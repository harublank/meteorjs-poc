import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import '../imports/api/users'
import { organizationCollection } from '../imports/api/organization'
import { contactsCollection } from '../imports/api/contacts'
const SEED_EMAIL = "keelaadmin@keela.com"
const SEED_PASSWORD = "keelapw"

const ORGANIZATION_ADMIN_EMAIL = 'orgadmin@keela.com'

const ROLES = {
  KEELA_ADMIN: "KEELA_ADMIN",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  COORDINATOR: "COORDINATOR"
}

Meteor.publish('organizationData', function () {
  return organizationCollection.find({})
})

Meteor.publish('myOrg', function (userId) {
  const myOrg = contactsCollection.findOne(
    { userId },
    {
      fields: { organizationId: 1 },
    }
  );

  if (!myOrg) {
    // User's organization not found, return an empty cursor
    return this.ready();
  }

  const orgCursor = organizationCollection.find(
    { _id: myOrg.organizationId },
    {
      fields: { address: 1, contact: 1, contacts: 1, name: 1 },
    }
  );

  const contactIds = orgCursor.map((org) => org.contacts).flat();
  const contactsCursor = contactsCollection.find(
    { _id: { $in: contactIds } },
    {
      transform: function (contact) {
        const user = Meteor.users.findOne({ _id: contact.userId });
        const data = {
          name: contact.name,
          email: user?.emails?.[0],
          role: user?.profile?.role,
          _id: contact._id,
        };
        return data;
      },
    }
  );

  const usersCursor = Meteor.users.find({})

  console.log(orgCursor.fetch(), contactsCursor.fetch())
  return [orgCursor, contactsCursor, usersCursor];
});

Meteor.publish("contactsCollection", function () {
  return contactsCollection.find({})
})

Meteor.startup(async () => {
  const userNotFound = Boolean(Accounts.findUserByEmail(SEED_EMAIL)) === false

  if (userNotFound) {
    console.log(`creating a seed  user with email ${SEED_EMAIL}`)
    Accounts.createUser({
      email: SEED_EMAIL, password: SEED_PASSWORD,
      profile: {
        role: ROLES.KEELA_ADMIN
      }
    })
  }

  const organizationAdminNotFound = Boolean(Accounts.findUserByEmail(ORGANIZATION_ADMIN_EMAIL)) === false
  if (organizationAdminNotFound) {
    console.log(`creating organization admin with email ${ORGANIZATION_ADMIN_EMAIL}`)
    Accounts.createUser({
      email: ORGANIZATION_ADMIN_EMAIL, password: SEED_PASSWORD,
      profile: {
        role: ROLES.ORGANIZATION_ADMIN
      }
    })
  }
})

Meteor.methods({
  'createContact': function (data) {
    console.log("creating contact", data)

    const { email, role } = data
    const userId = Accounts.createUser({
      email: email,
      password: "keelapw",
      profile: {
        role: role
      }
    })

    console.log("usssssssssser id", userId)
    return userId
  },

})