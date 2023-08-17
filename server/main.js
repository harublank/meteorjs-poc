import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const SEED_EMAIL = "keelaadmin@keela.com"
const SEED_PASSWORD = "keelapw"

const ORGANIZATION_ADMIN_EMAIL = 'orgadmin@keela.com'

const ROLES = {
  KEELA_ADMIN: "KEELA_ADMIN",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  COORDINATOR: "COORDINATOR"
}

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
