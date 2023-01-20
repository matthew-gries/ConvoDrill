import { Box, Button, Flex, Input, Text, useToast, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react'
import TreeView, { EventCallback, flattenTree, INode } from 'react-accessible-treeview';
import { ConvoEntry, ConvoEntryResponse, useConvoEntriesQuery, useCreateConvoEntryMutation, useCreateConvoEntryResponseMutation, useDeleteConvoEntryMutation, useDeleteConvoEntryResponseMutation, useUpdateConvoEntryMutation, useUpdateConvoEntryResponseMutation } from '../generated/graphql';
import { ConvoEntryEditDrawer, ConvoEntryEditDrawerProps } from './ConvoEntryEditDrawer';

type ConvoEntryIdMapType = Map<string, ConvoEntry>;

type TreeNode = {
  name: string;
  children?: TreeNode[]
}

interface ConvoEntryEditTreeViewProps extends Omit<ConvoEntryEditDrawerProps, "bodyContents"> {
  convoId: string;
}

export const ConvoEntryEditTreeView: React.FC<ConvoEntryEditTreeViewProps> = ({
  convoId,
  isDrawerOpen,
  onDrawerClose,
  buttonRef
}) => {

  const toast = useToast({
    duration: 9000,
    isClosable: true
  });
  const [treeData, setTreeData] = useState<TreeNode>({ name: "" });
  const [displayedConvoEntry, setDisplayedConvoEntry] = useState<ConvoEntry | null>(null);
  const [displayedConvoEntryResponse, setDisplayedConvoEntryResponse] = useState<ConvoEntryResponse | null>(null);
  const [convoEntryIdMap, setConvoEntryIdMap] = useState(new Map<string, ConvoEntry>());
  const [,createConvoEntry] = useCreateConvoEntryMutation();
  const [,createConvoEntryResponse] = useCreateConvoEntryResponseMutation();
  const [,updateConvoEntry] = useUpdateConvoEntryMutation();
  const [,updateConvoEntryResponse] = useUpdateConvoEntryResponseMutation();
  const [,deleteConvoEntry] = useDeleteConvoEntryMutation();
  const [,deleteConvoEntryResponse] = useDeleteConvoEntryResponseMutation();
  const [convoEntryFormFields, setConvoEntryFormFields] = useState({
    label: "",
    promptText: "",
    answerSuggestion: ""
  });
  const [convoEntryResponseFormFields, setConvoEntryResponseFormFields] = useState({
    label: "",
    responseText: ""
  });
  const [{data, fetching}, reexecuteUseConvoEntriesQuery] = useConvoEntriesQuery({
    variables: {
      convoId
    }
  });

  const bgTreeNode = useBreakpointValue({ base: 'transparent', sm: useColorModeValue("bg-surface", "blackAlpha.300") });
  const boxShadow = { base: 'none', sm: useColorModeValue('lg', 'xl') };

  const flattenedTreeData = flattenTree(treeData);

  /**
   * Set what convo entry or response to render info for
   */
  const setCurrentEntryOrResponseToRender = (element: INode) => {
    const convoEntry = convoEntryIdMap.get(element.name);
    if (!convoEntry) {
      const parentTreeNode = flattenedTreeData.find(node => node.id === element.parent);
      if (!parentTreeNode) {
        console.error("Can't find parent");
        return;
      }

      const convoEntryResponse = convoEntryIdMap
        .get(parentTreeNode.name)
        .childConvoEntryResponses
        .find(response => response.id === element.name);

      if (!convoEntryResponse) {
        console.error("Can't find response");
        return;
      }

      setDisplayedConvoEntry(null);
      setDisplayedConvoEntryResponse(convoEntryResponse);
      setConvoEntryResponseFormFields({
        label: convoEntryResponse.label,
        responseText: convoEntryResponse.responseText
      });
    } else {

      setDisplayedConvoEntry(convoEntry);
      setDisplayedConvoEntryResponse(null);
      setConvoEntryFormFields({
        label: convoEntry.label,
        promptText: convoEntry.promptText,
        answerSuggestion: convoEntry.answerSuggestion
      });
    }

  }

  /**
   * Format convo entry into tree view format
   */
  const formatConvoEntryAsTreeNode = (
    convoEntry: ConvoEntry,
    convoEntryIdMapNew: ConvoEntryIdMapType
  ): TreeNode => {

    return {
      name: convoEntry.id,
      children: convoEntry.childConvoEntryResponses.map(convoEntryResponse => 
        formatConvoEntryResponseAsTreeNode(convoEntryResponse, convoEntryIdMapNew))
    };
  }

  /**
   * Format convo entry response into tree view format
   */
  const formatConvoEntryResponseAsTreeNode = (
    convoEntryResponse: ConvoEntryResponse,
    convoEntryIdMapNew: ConvoEntryIdMapType
  ): TreeNode => {

    const children = (convoEntryResponse.childConvoEntryId
    ? [formatConvoEntryAsTreeNode(convoEntryIdMapNew.get(convoEntryResponse.childConvoEntryId), convoEntryIdMapNew)]
    : [])

    return {
      name: convoEntryResponse.id,
      children
    };
  }


  /**
   * Format convo entry data from graphql into tree view format
   */
  const formatDataAsTree = (convoEntriesData: ConvoEntry[], convoEntryIdMapNew: ConvoEntryIdMapType): TreeNode => {

    const root = convoEntriesData.find(convoEntry => convoEntry.isRoot);

    if (!root) {
      return { name: "" } // TODO maybe error
    }

    // Render top level + children 
    return {
      name: "",
      children: [
        {
          name: root.id,
          children: root.childConvoEntryResponses.map(convoEntryResponse =>
            formatConvoEntryResponseAsTreeNode(convoEntryResponse, convoEntryIdMapNew))
        }
      ]
    };
  }

  /**
   * Given the convo entry, render the component that is used to edit it's fields
   */
  const renderConvoEntryEditComponent = (convoEntry: ConvoEntry): JSX.Element => {

    return (
      <Box>
        <Text>Label</Text>
        <Input
          value={convoEntryFormFields.label}
          onChange={(event) => setConvoEntryFormFields({
            label: event.target.value,
            promptText: convoEntryFormFields.promptText,
            answerSuggestion: convoEntryFormFields.answerSuggestion
          })}
          placeholder="Label"
        />
        <Text>Prompt Text</Text>
        <Input
          value={convoEntryFormFields.promptText}
          onChange={(event) => setConvoEntryFormFields({
            label: convoEntryFormFields.label,
            promptText: event.target.value,
            answerSuggestion: convoEntryFormFields.answerSuggestion
          })}
          placeholder="Prompt Text"
        />
        <Text>Answer Suggestion</Text>
        <Input
          value={convoEntryFormFields.answerSuggestion}
          onChange={(event) => setConvoEntryFormFields({
            label: convoEntryFormFields.label,
            promptText: convoEntryFormFields.promptText,
            answerSuggestion: event.target.value
          })}
          placeholder="Prompt Text"
        />
        <Button mr={3} mt={4} mb={4} colorScheme='blue' onClick={async () => {
          const result = await updateConvoEntry({
            input: {
              convoId,
              label: convoEntryFormFields.label,
              promptText: convoEntryFormFields.promptText,
              answerSuggestion: convoEntryFormFields.answerSuggestion
            },
            updateConvoEntryId: convoEntry.id
          });

          if (result.error) {
            toast({
              title: "Update Failed",
              description: "Failed to update entry",
              status: 'error'
            })
          } else if (result.data) {
            toast({
              title: "Update Succeeded",
              status: 'success'
            })
          }

          reexecuteUseConvoEntriesQuery({requestPolicy: 'network-only'});
        }}
        >
          Submit
        </Button>
      </Box>
    );
  }

  /**
   * Given the convo entry, render the component that is used to edit it's fields
   */
  const renderConvoEntryResponseEditComponent = (convoEntryResponse: ConvoEntryResponse): JSX.Element => {

    return (
      <Box>
        <Text>Label</Text>
        <Input
          value={convoEntryResponseFormFields.label}
          onChange={(event) => setConvoEntryResponseFormFields({
            label: event.target.value,
            responseText: convoEntryResponseFormFields.responseText
          })}
          placeholder="Label"
        />
        <Text>Response Text</Text>
        <Input
          value={convoEntryResponseFormFields.responseText}
          onChange={(event) => setConvoEntryResponseFormFields({
            label: convoEntryResponseFormFields.label,
            responseText: event.target.value
          })}
          placeholder="Response Text"
        />
        <Button mr={3} mt={4} mb={4} colorScheme='blue' onClick={async () => {
          const result = await updateConvoEntryResponse({
            input: {
              parentConvoEntryId: convoEntryResponse.parentConvoEntryId,
              label: convoEntryResponseFormFields.label,
              responseText: convoEntryResponseFormFields.responseText
            },
            updateConvoEntryResponseId: convoEntryResponse.id
          });

          if (result.error) {
            toast({
              title: "Update Failed",
              description: "Failed to update response",
              status: 'error'
            })
          } else if (result.data) {
            toast({
              title: "Update Succeeded",
              status: 'success'
            })
          }

          reexecuteUseConvoEntriesQuery({requestPolicy: 'network-only'});
        }}
        >
          Submit
        </Button>
      </Box>
    );
  }

  /**
   * Given the convo entry response, add a child convo entry
   */
  const addConvoEntryFromResponse = async (convoEntryResponse: ConvoEntryResponse, isExpanded: boolean, handleExpand: EventCallback, event: any) => {

    const result = await createConvoEntry({
      input: {
        convoId,
        parentConvoEntryResponseId: convoEntryResponse.id,
        label: `new-entry`,
        answerSuggestion: "Put a suggestion here...",
        promptText: "Enter prompt here!"
      }
    });

    if (result.error) {
      toast({
        title: "Create Failed",
        description: "Failed to create entry",
        status: 'error'
      })
    } else if (result.data) {
      toast({
        title: "Create Succeeded",
        status: 'success'
      })
    }

    if (isExpanded) {
      handleExpand(event);
    }

    reexecuteUseConvoEntriesQuery({requestPolicy: 'network-only'});
  }

  /**
   * Given the convo entry, add a child convo entry response
   */
  const addResponseFromConvoEntry = async (convoEntry: ConvoEntry, isExpanded: boolean, handleExpand: EventCallback, event: any) => {
  
    // At this point we have the convo entry so make a response to it
    const result = await createConvoEntryResponse({
      input: {
        label: `new-response`,
        parentConvoEntryId: convoEntry.id,
        responseText: "Enter response here!"
      }
    });

    if (result.error) {
      toast({
        title: "Create Failed",
        description: "Failed to create response",
        status: 'error'
      })
    } else if (result.data) {
      toast({
        title: "Create Succeeded",
        status: 'success'
      })
    }

    if (isExpanded) {
      handleExpand(event);
    }

    reexecuteUseConvoEntriesQuery({requestPolicy: 'network-only'});
  }

    /**
   * Given the convo entry response, add a child convo entry
   */
    const deleteConvoEntryResponseFromTree = async (convoEntryResponse: ConvoEntryResponse) => {

      const result = await deleteConvoEntryResponse({
        parentConvoEntryId: convoEntryResponse.parentConvoEntryId,
        deleteConvoEntryResponseId: convoEntryResponse.id
      });
  
      if (result.error) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete response",
          status: 'error'
        })
      } else if (result.data) {
        toast({
          title: "Delete Succeeded",
          status: 'success'
        })
      }
  
      reexecuteUseConvoEntriesQuery({requestPolicy: 'network-only'});
    }
  
    /**
     * Given the convo entry, add a child convo entry response
     */
    const deleteConvoEntryFromTree = async (convoEntry: ConvoEntry) => {

      if (convoEntry.isRoot) {
        console.log("Tried to delete root node but returned early");
        return;
      }
    
      // At this point we have the convo entry so make a response to it
      const result = await deleteConvoEntry({
        convoId,
        deleteConvoEntryId: convoEntry.id
      });
  
      if (result.error) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete entry",
          status: 'error'
        })
      } else if (result.data) {
        toast({
          title: "Delete Succeeded",
          status: 'success'
        })
      }
  
  
      reexecuteUseConvoEntriesQuery({requestPolicy: 'network-only'});
    }

  /**
   * Render the nodes of the tree, with the label, and an add/delete button
   */
  const renderTreeEntry = (element: INode, isSelected: boolean, isExpanded: boolean, handleExpand: EventCallback): JSX.Element => {
    const convoEntry = convoEntryIdMap.get(element.name);
    if (!convoEntry) {
      const parentTreeNode = flattenedTreeData.find(node => node.id === element.parent);
      if (!parentTreeNode) {
        return <div>Can&apos;t find parent</div>;
      }

      const convoEntryResponse = convoEntryIdMap
        .get(parentTreeNode.name)
        .childConvoEntryResponses
        .find(response => response.id === element.name);

      if (!convoEntryResponse) {
        return <div>Can&apos;t find response</div>
      }

      return (
        <Flex p={1} className="tree-node-box">
          <Box
            onClick={() => setCurrentEntryOrResponseToRender(element)}
            whiteSpace="normal"
            overflow="hidden"
            bg={bgTreeNode}
            boxShadow={boxShadow}
            borderRadius="lg"
            padding={2}
            borderWidth={isSelected ? 3 : 1}
          >
            <Text as="i">
              {convoEntryResponse.label}
            </Text>
          </Box>
          {!convoEntryResponse.childConvoEntryId ? (
            <Box
              onClick={(event) => addConvoEntryFromResponse(convoEntryResponse, isExpanded, handleExpand, event)}
              ml={1}
              bg={bgTreeNode}
              boxShadow={boxShadow}
              borderRadius="md"
              borderWidth={1}
              height="fit-content"
              px={1}
            >
              +
            </Box>
          ) : null}
          <Box
            onClick={() => deleteConvoEntryResponseFromTree(convoEntryResponse)}
            ml={1}
            bg={bgTreeNode}
            boxShadow={boxShadow}
            borderRadius="md"
            borderWidth={1}
            height="fit-content"
            px={1}
          >
            x
          </Box>
        </Flex>
      );
    }

    return (
      <Flex p={1} className="tree-node-box">
        <Box
          className="tree-node-label"
          onClick={() => setCurrentEntryOrResponseToRender(element)}
          whiteSpace="normal"
          overflow="hidden"
          bg={bgTreeNode}
          boxShadow={boxShadow}
          borderRadius="lg"
          padding={2}
          borderWidth={isSelected ? 3 : 1}
        >
          {convoEntry.label}
        </Box>
        <Box
          className="tree-node-add-button"
          onClick={(event) => addResponseFromConvoEntry(convoEntry, isExpanded, handleExpand, event)}
          ml={1}
          bg={bgTreeNode}
          boxShadow={boxShadow}
          borderRadius="md"
          borderWidth={1}
          height="fit-content"
          px={1}
        >
          +
        </Box>
        <Box
          className="tree-node-delete-button"
          onClick={() => deleteConvoEntryFromTree(convoEntry)}
          ml={1}
          bg={bgTreeNode}
          boxShadow={boxShadow}
          borderRadius="md"
          borderWidth={1}
          height="fit-content"
          px={1}
        >
          x
        </Box>
      </Flex>
    );
  }

  useEffect(() => {

    if ((!fetching && !data) || fetching) { return; }

    const timerId = setTimeout(() => {
      if (data && !fetching) {
        const newMap = new Map<string, ConvoEntry>(
          data.convoEntries.map(convoEntry => [convoEntry.id, convoEntry as ConvoEntry]));
        setTreeData(formatDataAsTree(data.convoEntries as ConvoEntry[], newMap));
        setConvoEntryIdMap(newMap);
      }
    });

    return () => clearTimeout(timerId);

  }, [data, setTreeData, setConvoEntryIdMap, fetching, formatDataAsTree]);

  if (!data && !fetching) {
    return <div>Query failed</div>
  }

  const renderTree = (): JSX.Element => {
    return (
      <Box
        w="100%"
        h="60vh"
        // border="1px solid blue"
        padding={1}
        overflowX="hidden"
        overflowY="hidden"
      >
        <Box
          boxSizing="border-box"
          // border="1px solid #AAAAAA"
          height="65vh"
          maxHeight="100%"
          padding={4}
          overflowX="auto" /* Make the child scroll */
          overflowY="auto" /* Make the child scroll */
          width="100%"
        >
          <TreeView
            data={flattenedTreeData}
            className="convo-entry-tree"
            aria-label="Tree view of all conversation entries"
            nodeRenderer={({ element, getNodeProps, level, isExpanded, handleExpand, isSelected }) => (
              <div 
                {...getNodeProps()}
                style={{
                  paddingLeft: 30 * (level - 1),
                  marginLeft: 10 * (level - 1)
                }}
              >
                {renderTreeEntry(element, isSelected, isExpanded, handleExpand)}
              </div>
            )}
          />
        </Box>
      </Box>
    );
  }

  const renderTreeEntryInfoBox = (): JSX.Element => {
    return (
      <Box>
        {(() => {
          if (!displayedConvoEntry && !displayedConvoEntryResponse) {
            return <Box p={3}>Select an entry or response</Box>
          } else if (displayedConvoEntry) {
            return <Box p={3}>{renderConvoEntryEditComponent(displayedConvoEntry)}</Box>
          } else if (displayedConvoEntryResponse) {
            return <Box p={3}>{renderConvoEntryResponseEditComponent(displayedConvoEntryResponse)}</Box>
          } else {
            return <Box>Unreachable state</Box>
          }
        })()}
      </Box>
    );
  }

  return (
    <Box>
      {(!data && fetching) ? <Box>Loading</Box> : (
        <Box>
          {renderTree()}
          <ConvoEntryEditDrawer
            isDrawerOpen={isDrawerOpen}
            onDrawerClose={onDrawerClose}
            buttonRef={buttonRef}
            bodyContents={renderTreeEntryInfoBox()}
          />
        </Box>
      )}
    </Box>
  );
}