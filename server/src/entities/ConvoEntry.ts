import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Convo } from "./Convo";
import { ConvoEntryResponse } from "./ConvoEntryResponse";

@ObjectType()
@Entity()
export class ConvoEntry extends BaseEntity {

  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  label!: string;

  @Field()
  @Column()
  promptText!: string;

  @Field()
  @Column()
  answerSuggestion!: string;

  @Field(() => Boolean)
  @Column({default: false})
  isRoot!: boolean;

  // Relations

  // convo this entry belongs to

  @Field(() => Convo)
  @ManyToOne(() => Convo, convo => convo.convoEntries, {onDelete: 'CASCADE'})
  convo: Convo;

  @Field()
  @Column()
  convoId: string;

  // responses acceptable for this entry

  @Field(() => [ConvoEntryResponse])
  @OneToMany(() => ConvoEntryResponse, convoEntryResponse => convoEntryResponse.parentConvoEntry)
  childConvoEntryResponses: ConvoEntryResponse[];

  // responses that lead to this entry

  @Field(() => [ConvoEntryResponse])
  @OneToMany(() => ConvoEntryResponse, convoEntryRepsonse => convoEntryRepsonse.childConvoEntry)
  parentConvoEntryResponses: ConvoEntryResponse[];

  // Dates

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}