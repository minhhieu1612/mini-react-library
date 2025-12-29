// ================= Base Types ===========
type mixed = any;
type TagType = any;
type Lane = number;

export type Cache = {
  controller: AbortController;
  data: Map<() => mixed, mixed>;
  refCount: number;
};

type ReactFormState<S, ReferenceId> = [
  S /* actual state value */,
  string /* key path */,
  ReferenceId /* Server Reference ID */,
  number /* number of bound arguments */
];
type RootState = {
  element: any;
  isDehydrated: boolean;
  cache: Cache;
};

// ================= Queue types ==========
type Update<State> = {
  lane: Lane;

  tag: 0 | 1 | 2 | 3;
  payload: any;
  callback: (() => any) | null;

  next: Update<State> | null;
};
type SharedQueue<State> = {
  pending: Update<State> | null;
  lanes: Lane[];
  hiddenCallbacks: Array<() => mixed> | null;
};
type UpdateQueue<State> = {
  baseState: State;
  firstBaseUpdate: Update<State> | null;
  lastBaseUpdate: Update<State> | null;
  shared: SharedQueue<State>;
  callbacks: Array<() => mixed> | null;
};

// ============= Node Type =================
type FiberNode = {
  tag: TagType;
  containerInfo: any; // DOM container
  pendingChildren: any;
  current: Fiber | null; // to store fiber

  pingCache: any;
  timeoutHandle: any;
  cancelPendingCommit: any;
  context: any;
  pendingContext: any;
  next: any;
  callbackNode: any;

  // properties involve timing for update
  callbackPriority: Lane;
  expirationTimes: number[]; // timestamps for all lanes with 31 lanes
  pendingLanes: Lane;
  suspendedLanes: Lane;
  pingedLanes: Lane;
  warmLanes: Lane;
  expiredLanes: Lane;
  errorRecoveryDisabledLanes: Lane;
  shellSuspendCounter: any;
  entangledLanes: Lane;
  entanglements: Lane[];
  hiddenUpdates: Lane[][];

  identifierPrefix: any;

  // error handlers
  onUncaughtError: any;
  onCaughtError: any;
  onRecoverableError: any;

  pooledCache: any;
  pooledCacheLanes: Lane;
  formState: ReactFormState<any, string>;
};

type Fiber = {
  tag: TagType;
  key: string;
  elementType: any;
  type: any;
  stateNode: FiberNode | null;

  // fiber relations
  return: any;
  child: any;
  sibling: any;
  index: any;

  ref: any;
  refCleanup: any;

  // data for update node/component
  pendingProps: any;
  memoizedProps: any;
  updateQueue: UpdateQueue<any>;
  memoizedState: RootState | null;
  dependencies: any;

  mode: any;

  flags: any;
  subtreeFlags: any;
  deletions: any;

  // scheduling
  lanes: Lane;
  childLanes: any;
  alternate: any;
};
