import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConvoEntry } from "./ConvoEntry";

@ObjectType()
@Entity()
export class ConvoEntryResponse extends BaseEntity {

  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  responseText!: string;

  @Field()
  @Column()
  label!: string;

  // Relations

  // the convo entry that this response belongs to

  @Field(() => ConvoEntry, {nullable: true})
  @ManyToOne(() => ConvoEntry, convoEntry => convoEntry.parentConvoEntryResponses, {nullable: true, onDelete: 'CASCADE'})
  childConvoEntry: ConvoEntry | null;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  childConvoEntryId: string | null;

  // the convo entry that this repsonse leads to (i.e. is the parent of)

  @Field(() => ConvoEntry)
  @ManyToOne(() => ConvoEntry, convoEntry => convoEntry.childConvoEntryResponses, {onDelete: 'CASCADE'})
  parentConvoEntry: ConvoEntry;

  @Field()
  @Column()
  parentConvoEntryId: string;

  // Dates

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}