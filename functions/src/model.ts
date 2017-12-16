/**
 * Remove the variants of the second union of string literals from
 * the first.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */
type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

/**
 * Drop keys `K` from `T`.
 *
 * @see https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-307871458
 */
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

export interface DB {
  customerInvites: {
    [invitationId: string]: Omit<CustomerInvitation, 'id'>
  }
}

export interface Customer {
  readonly id: string
  readonly name: string
  readonly kennitala: string
  readonly navisionId: string
  divisions: ReadonlyArray<CustomerDivision>
}
export interface CustomerDivision {
  readonly navisionId: string
  readonly name: string
  readonly address: string
}

export const enum EmployeeRole {
  Manager = 'manager',
  Employee = 'employee',
}

export interface CustomerInvitation {
  id: string
  customerId: string
  customerName: string
  email: string
  expires: Date
  role: EmployeeRole
  usedBy?: {
    uid: string
    userDisplayName: string
  }
}

export interface UserRecord {
  uid: string
  displayName: string
  email: string
  photoURL: string
  customerId?: string
}

export interface UserClaims {
  isAdmin?: boolean
  customer?: { id: string; name: string; role: EmployeeRole }
}
