import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  BaseEntity
} from "typeorm";
import uuidv4 = require("uuid/v4");

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn("uuid") id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text") password: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
