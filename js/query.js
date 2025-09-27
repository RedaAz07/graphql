


export const quer = `
{
  user {
    firstName
    lastName
    level: transactions(
      where: {type: {_eq: "level"}, event: {object: {name: {_eq: "Module"}}}}
      order_by: {amount: desc}
      limit: 1
    ) {
      amount
    }
  }
  totalXp: transaction_aggregate(
    where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
  skills: user {
    transactions(
      where: {type: {_nin: ["xp", "level", "up", "down"]}}
      distinct_on: type
      order_by: {type: asc, amount: desc}
    ) {
      skillType: type
      skillAmount: amount
    } 
  }
  audit  : user {
    auditRatio
    sucess: audits_aggregate(where: {closureType: {_eq: succeeded}}) {
      aggregate {
        count
      }
    }
    failed: audits_aggregate(where: {closureType: {_eq: failed}}) {
      aggregate {
        count
      }
    }
  }
    projects : user {

        finished_projects: groups(where: {
            group: {status: {_eq: finished}, _and: 
                {eventId: {_eq: 41}}
            }
        } order_by: {  updatedAt: desc}) {
            group { path members(where : {accepted : {_eq : true }}) { userLogin } updatedAt
}
        }
    }
}`