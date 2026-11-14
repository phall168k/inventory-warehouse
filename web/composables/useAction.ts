import { CRUD_ACTION_KEY } from '~/types/crud'

/** Reactive dialog action for custom forms rendered inside Table's form slot. */
export const useAction = () => {
  const action = inject(CRUD_ACTION_KEY)
  if (!action) throw new Error('useAction must be used inside a Table form slot')
  return action
}
