import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const organizationCollection = new Mongo.Collection('organization')

const organizationSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Organization Name"
    },
    address: {
        type: String,
        label: "Address"
    },
    number: {
        type: Number,
        label: "Contact Number"
    }

})
// organizationCollection.attatchSchema(organizationSchema)

