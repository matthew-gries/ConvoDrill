import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Convo = {
  __typename?: 'Convo';
  convoEntries?: Maybe<Array<ConvoEntry>>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  nativeLanguage: Scalars['String'];
  rootConvoEntry?: Maybe<ConvoEntry>;
  targetLanguage: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['String'];
};

export type ConvoEntry = {
  __typename?: 'ConvoEntry';
  answerSuggestion: Scalars['String'];
  childConvoEntryResponses: Array<ConvoEntryResponse>;
  convo: Convo;
  convoId: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['String'];
  isRoot: Scalars['Boolean'];
  label: Scalars['String'];
  parentConvoEntryResponses: Array<ConvoEntryResponse>;
  promptText: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ConvoEntryInput = {
  answerSuggestion: Scalars['String'];
  convoId: Scalars['String'];
  label: Scalars['String'];
  parentConvoEntryResponseId?: InputMaybe<Scalars['String']>;
  promptText: Scalars['String'];
};

export type ConvoEntryResponse = {
  __typename?: 'ConvoEntryResponse';
  childConvoEntry?: Maybe<ConvoEntry>;
  childConvoEntryId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  id: Scalars['String'];
  label: Scalars['String'];
  parentConvoEntry: ConvoEntry;
  parentConvoEntryId: Scalars['String'];
  responseText: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type ConvoEntryResponseInput = {
  label: Scalars['String'];
  parentConvoEntryId: Scalars['String'];
  responseText: Scalars['String'];
};

export type ConvoInput = {
  nativeLanguage: Scalars['String'];
  targetLanguage: Scalars['String'];
  title: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createConvo: Convo;
  createConvoEntry: ConvoEntry;
  createConvoEntryResponse: ConvoEntryResponse;
  deleteConvo: Scalars['Boolean'];
  deleteConvoEntry: Scalars['Boolean'];
  deleteConvoEntryResponse: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updateConvo?: Maybe<Convo>;
  updateConvoEntry?: Maybe<ConvoEntry>;
  updateConvoEntryResponse?: Maybe<ConvoEntryResponse>;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateConvoArgs = {
  input: ConvoInput;
};


export type MutationCreateConvoEntryArgs = {
  input: ConvoEntryInput;
};


export type MutationCreateConvoEntryResponseArgs = {
  input: ConvoEntryResponseInput;
};


export type MutationDeleteConvoArgs = {
  id: Scalars['String'];
};


export type MutationDeleteConvoEntryArgs = {
  convoId: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeleteConvoEntryResponseArgs = {
  id: Scalars['String'];
  parentConvoEntryId: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UserFieldInput;
};


export type MutationUpdateConvoArgs = {
  id: Scalars['String'];
  input: ConvoInput;
};


export type MutationUpdateConvoEntryArgs = {
  id: Scalars['String'];
  input: ConvoEntryInput;
};


export type MutationUpdateConvoEntryResponseArgs = {
  id: Scalars['String'];
  input: ConvoEntryResponseInput;
};

export type PaginatedConvos = {
  __typename?: 'PaginatedConvos';
  convos: Array<Convo>;
  hasMore: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  convo?: Maybe<Convo>;
  convoEntries?: Maybe<Array<ConvoEntry>>;
  convoEntry?: Maybe<ConvoEntry>;
  convoEntryResponse?: Maybe<ConvoEntryResponse>;
  convos: PaginatedConvos;
  me?: Maybe<User>;
};


export type QueryConvoArgs = {
  id: Scalars['String'];
};


export type QueryConvoEntriesArgs = {
  convoId: Scalars['String'];
};


export type QueryConvoEntryArgs = {
  id: Scalars['String'];
};


export type QueryConvoEntryResponseArgs = {
  id: Scalars['String'];
  parentConvoEntryId: Scalars['String'];
};


export type QueryConvosArgs = {
  limit: Scalars['Int'];
  skip: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  convos: Array<Convo>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserFieldInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: string, username: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type CreateConvoMutationVariables = Exact<{
  input: ConvoInput;
}>;


export type CreateConvoMutation = { __typename?: 'Mutation', createConvo: { __typename?: 'Convo', id: string, targetLanguage: string, nativeLanguage: string, title: string } };

export type CreateConvoEntryMutationVariables = Exact<{
  input: ConvoEntryInput;
}>;


export type CreateConvoEntryMutation = { __typename?: 'Mutation', createConvoEntry: { __typename?: 'ConvoEntry', id: string, label: string, promptText: string, answerSuggestion: string } };

export type CreateConvoEntryResponseMutationVariables = Exact<{
  input: ConvoEntryResponseInput;
}>;


export type CreateConvoEntryResponseMutation = { __typename?: 'Mutation', createConvoEntryResponse: { __typename?: 'ConvoEntryResponse', childConvoEntryId?: string | null, id: string, label: string, responseText: string, parentConvoEntry: { __typename?: 'ConvoEntry', id: string, isRoot: boolean, label: string, promptText: string, answerSuggestion: string, parentConvoEntryResponses: Array<{ __typename?: 'ConvoEntryResponse', id: string }> }, childConvoEntry?: { __typename?: 'ConvoEntry', id: string, isRoot: boolean, label: string, promptText: string, answerSuggestion: string, childConvoEntryResponses: Array<{ __typename?: 'ConvoEntryResponse', id: string }> } | null } };

export type DeleteConvoMutationVariables = Exact<{
  deleteConvoId: Scalars['String'];
}>;


export type DeleteConvoMutation = { __typename?: 'Mutation', deleteConvo: boolean };

export type DeleteConvoEntryMutationVariables = Exact<{
  convoId: Scalars['String'];
  deleteConvoEntryId: Scalars['String'];
}>;


export type DeleteConvoEntryMutation = { __typename?: 'Mutation', deleteConvoEntry: boolean };

export type DeleteConvoEntryResponseMutationVariables = Exact<{
  parentConvoEntryId: Scalars['String'];
  deleteConvoEntryResponseId: Scalars['String'];
}>;


export type DeleteConvoEntryResponseMutation = { __typename?: 'Mutation', deleteConvoEntryResponse: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UserFieldInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type UpdateConvoMutationVariables = Exact<{
  input: ConvoInput;
  updateConvoId: Scalars['String'];
}>;


export type UpdateConvoMutation = { __typename?: 'Mutation', updateConvo?: { __typename?: 'Convo', id: string, title: string, targetLanguage: string, nativeLanguage: string, userId: string } | null };

export type UpdateConvoEntryMutationVariables = Exact<{
  input: ConvoEntryInput;
  updateConvoEntryId: Scalars['String'];
}>;


export type UpdateConvoEntryMutation = { __typename?: 'Mutation', updateConvoEntry?: { __typename?: 'ConvoEntry', id: string, convoId: string, answerSuggestion: string, promptText: string, label: string } | null };

export type UpdateConvoEntryResponseMutationVariables = Exact<{
  input: ConvoEntryResponseInput;
  updateConvoEntryResponseId: Scalars['String'];
}>;


export type UpdateConvoEntryResponseMutation = { __typename?: 'Mutation', updateConvoEntryResponse?: { __typename?: 'ConvoEntryResponse', id: string, label: string, responseText: string, parentConvoEntryId: string } | null };

export type ConvoQueryVariables = Exact<{
  convoId: Scalars['String'];
}>;


export type ConvoQuery = { __typename?: 'Query', convo?: { __typename?: 'Convo', id: string, targetLanguage: string, nativeLanguage: string, title: string, convoEntries?: Array<{ __typename?: 'ConvoEntry', id: string, label: string, promptText: string, answerSuggestion: string }> | null, rootConvoEntry?: { __typename?: 'ConvoEntry', id: string, label: string, promptText: string, answerSuggestion: string } | null } | null };

export type ConvoEntriesQueryVariables = Exact<{
  convoId: Scalars['String'];
}>;


export type ConvoEntriesQuery = { __typename?: 'Query', convoEntries?: Array<{ __typename?: 'ConvoEntry', id: string, promptText: string, label: string, answerSuggestion: string, isRoot: boolean, childConvoEntryResponses: Array<{ __typename?: 'ConvoEntryResponse', id: string, label: string, responseText: string, parentConvoEntryId: string, childConvoEntryId?: string | null }>, parentConvoEntryResponses: Array<{ __typename?: 'ConvoEntryResponse', id: string, label: string, responseText: string, parentConvoEntryId: string, childConvoEntryId?: string | null }> }> | null };

export type ConvoEntryQueryVariables = Exact<{
  convoEntryId: Scalars['String'];
}>;


export type ConvoEntryQuery = { __typename?: 'Query', convoEntry?: { __typename?: 'ConvoEntry', id: string, convoId: string, isRoot: boolean, label: string, answerSuggestion: string, promptText: string, parentConvoEntryResponses: Array<{ __typename?: 'ConvoEntryResponse', id: string, childConvoEntryId?: string | null, responseText: string, label: string }>, childConvoEntryResponses: Array<{ __typename?: 'ConvoEntryResponse', id: string, childConvoEntryId?: string | null, responseText: string, label: string }> } | null };

export type ConvosQueryVariables = Exact<{
  limit: Scalars['Int'];
  skip: Scalars['Int'];
}>;


export type ConvosQuery = { __typename?: 'Query', convos: { __typename?: 'PaginatedConvos', hasMore: boolean, convos: Array<{ __typename?: 'Convo', id: string, title: string, nativeLanguage: string, targetLanguage: string, rootConvoEntry?: { __typename?: 'ConvoEntry', id: string, label: string, promptText: string, answerSuggestion: string } | null }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string } | null };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateConvoDocument = gql`
    mutation CreateConvo($input: ConvoInput!) {
  createConvo(input: $input) {
    id
    targetLanguage
    nativeLanguage
    title
  }
}
    `;

export function useCreateConvoMutation() {
  return Urql.useMutation<CreateConvoMutation, CreateConvoMutationVariables>(CreateConvoDocument);
};
export const CreateConvoEntryDocument = gql`
    mutation CreateConvoEntry($input: ConvoEntryInput!) {
  createConvoEntry(input: $input) {
    id
    label
    promptText
    answerSuggestion
  }
}
    `;

export function useCreateConvoEntryMutation() {
  return Urql.useMutation<CreateConvoEntryMutation, CreateConvoEntryMutationVariables>(CreateConvoEntryDocument);
};
export const CreateConvoEntryResponseDocument = gql`
    mutation CreateConvoEntryResponse($input: ConvoEntryResponseInput!) {
  createConvoEntryResponse(input: $input) {
    childConvoEntryId
    id
    label
    responseText
    parentConvoEntry {
      id
      isRoot
      label
      promptText
      answerSuggestion
      parentConvoEntryResponses {
        id
      }
    }
    childConvoEntry {
      id
      isRoot
      label
      promptText
      answerSuggestion
      childConvoEntryResponses {
        id
      }
    }
  }
}
    `;

export function useCreateConvoEntryResponseMutation() {
  return Urql.useMutation<CreateConvoEntryResponseMutation, CreateConvoEntryResponseMutationVariables>(CreateConvoEntryResponseDocument);
};
export const DeleteConvoDocument = gql`
    mutation DeleteConvo($deleteConvoId: String!) {
  deleteConvo(id: $deleteConvoId)
}
    `;

export function useDeleteConvoMutation() {
  return Urql.useMutation<DeleteConvoMutation, DeleteConvoMutationVariables>(DeleteConvoDocument);
};
export const DeleteConvoEntryDocument = gql`
    mutation DeleteConvoEntry($convoId: String!, $deleteConvoEntryId: String!) {
  deleteConvoEntry(convoId: $convoId, id: $deleteConvoEntryId)
}
    `;

export function useDeleteConvoEntryMutation() {
  return Urql.useMutation<DeleteConvoEntryMutation, DeleteConvoEntryMutationVariables>(DeleteConvoEntryDocument);
};
export const DeleteConvoEntryResponseDocument = gql`
    mutation DeleteConvoEntryResponse($parentConvoEntryId: String!, $deleteConvoEntryResponseId: String!) {
  deleteConvoEntryResponse(
    parentConvoEntryId: $parentConvoEntryId
    id: $deleteConvoEntryResponseId
  )
}
    `;

export function useDeleteConvoEntryResponseMutation() {
  return Urql.useMutation<DeleteConvoEntryResponseMutation, DeleteConvoEntryResponseMutationVariables>(DeleteConvoEntryResponseDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UserFieldInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateConvoDocument = gql`
    mutation UpdateConvo($input: ConvoInput!, $updateConvoId: String!) {
  updateConvo(input: $input, id: $updateConvoId) {
    id
    title
    targetLanguage
    nativeLanguage
    userId
  }
}
    `;

export function useUpdateConvoMutation() {
  return Urql.useMutation<UpdateConvoMutation, UpdateConvoMutationVariables>(UpdateConvoDocument);
};
export const UpdateConvoEntryDocument = gql`
    mutation UpdateConvoEntry($input: ConvoEntryInput!, $updateConvoEntryId: String!) {
  updateConvoEntry(input: $input, id: $updateConvoEntryId) {
    id
    convoId
    answerSuggestion
    promptText
    label
  }
}
    `;

export function useUpdateConvoEntryMutation() {
  return Urql.useMutation<UpdateConvoEntryMutation, UpdateConvoEntryMutationVariables>(UpdateConvoEntryDocument);
};
export const UpdateConvoEntryResponseDocument = gql`
    mutation UpdateConvoEntryResponse($input: ConvoEntryResponseInput!, $updateConvoEntryResponseId: String!) {
  updateConvoEntryResponse(input: $input, id: $updateConvoEntryResponseId) {
    id
    label
    responseText
    parentConvoEntryId
  }
}
    `;

export function useUpdateConvoEntryResponseMutation() {
  return Urql.useMutation<UpdateConvoEntryResponseMutation, UpdateConvoEntryResponseMutationVariables>(UpdateConvoEntryResponseDocument);
};
export const ConvoDocument = gql`
    query Convo($convoId: String!) {
  convo(id: $convoId) {
    id
    targetLanguage
    nativeLanguage
    title
    convoEntries {
      id
      label
      promptText
      answerSuggestion
    }
    rootConvoEntry {
      id
      label
      promptText
      answerSuggestion
    }
  }
}
    `;

export function useConvoQuery(options: Omit<Urql.UseQueryArgs<ConvoQueryVariables>, 'query'>) {
  return Urql.useQuery<ConvoQuery, ConvoQueryVariables>({ query: ConvoDocument, ...options });
};
export const ConvoEntriesDocument = gql`
    query ConvoEntries($convoId: String!) {
  convoEntries(convoId: $convoId) {
    id
    promptText
    label
    answerSuggestion
    isRoot
    childConvoEntryResponses {
      id
      label
      responseText
      parentConvoEntryId
      childConvoEntryId
    }
    parentConvoEntryResponses {
      id
      label
      responseText
      parentConvoEntryId
      childConvoEntryId
    }
  }
}
    `;

export function useConvoEntriesQuery(options: Omit<Urql.UseQueryArgs<ConvoEntriesQueryVariables>, 'query'>) {
  return Urql.useQuery<ConvoEntriesQuery, ConvoEntriesQueryVariables>({ query: ConvoEntriesDocument, ...options });
};
export const ConvoEntryDocument = gql`
    query ConvoEntry($convoEntryId: String!) {
  convoEntry(id: $convoEntryId) {
    id
    convoId
    isRoot
    label
    answerSuggestion
    promptText
    parentConvoEntryResponses {
      id
      childConvoEntryId
      responseText
      label
    }
    childConvoEntryResponses {
      id
      childConvoEntryId
      responseText
      label
    }
  }
}
    `;

export function useConvoEntryQuery(options: Omit<Urql.UseQueryArgs<ConvoEntryQueryVariables>, 'query'>) {
  return Urql.useQuery<ConvoEntryQuery, ConvoEntryQueryVariables>({ query: ConvoEntryDocument, ...options });
};
export const ConvosDocument = gql`
    query Convos($limit: Int!, $skip: Int!) {
  convos(limit: $limit, skip: $skip) {
    hasMore
    convos {
      id
      title
      nativeLanguage
      targetLanguage
      rootConvoEntry {
        id
        label
        promptText
        answerSuggestion
      }
    }
  }
}
    `;

export function useConvosQuery(options: Omit<Urql.UseQueryArgs<ConvosQueryVariables>, 'query'>) {
  return Urql.useQuery<ConvosQuery, ConvosQueryVariables>({ query: ConvosDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};