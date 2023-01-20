import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConvoEntry } from "./ConvoEntry";
import { User } from "./User";


@ObjectType()
@Entity()
export class Convo extends BaseEntity {

  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column({ nullable: false })
  targetLanguage!: String;

  @Field(() => String)
  @Column({ nullable: false })
  nativeLanguage!: String;

  @Field(() => String)
  @Column({ nullable: false })
  title!: String;

  @Field(() => ConvoEntry, { nullable: true })
  rootConvoEntry: ConvoEntry | null;

  // Relations

  @Field(() => User)
  @ManyToOne(() => User, user => user.convos)
  user: User;

  @Field()
  @Column()
  userId: string;

  @Field(() => [ConvoEntry], {nullable: true})
  @OneToMany(() => ConvoEntry, convoEntry => convoEntry.convo)
  convoEntries: ConvoEntry[]

  // Dates

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}