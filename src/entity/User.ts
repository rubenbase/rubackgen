import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert} from "typeorm";
import uuidv4 = require('uuid/v4');


@Entity()
export class User {

    @PrimaryColumn("uuid") 
    id: string;

    @Column("varchar", {length: 255})
    email: string;

    @Column("text")
    password: string;

    @BeforeInsert()
    addId(){
        this.id = uuidv4();
    }

}
