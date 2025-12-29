+ FiberNode has current => Fiber and Fiber has stateNode => FiberNode
+ Fiber contains memoizedState and updateQueue info
+ Fiber also store relations between fibers, ref info, pendingProps, 
memoizedProps and dependencies

*Render mechanism:
1, Schedule root:
  + initialize an update and enqueue this update, fiber info, fiber 
  pending queue in an internal share queue: concurrentQueues(in 
  enqueueConcurrentClassUpdate method)
  + schedule root into a link list and store it in firstScheduledRoot
  and lastScheduledRoot (in ensureRootIsScheduled method) and set 
  mightHavePendingSyncWork flag to true to start working on update of 
  root FiberNode
2, Process update:
  + init lane = DefaultLane = 32 (0b0000000000000000000000000100000)
  + scheduleUpdateOnFiber this just check whether the root has any 
  committed update tasks(state changes, transition check, defered 
  background process,...)
  + schedule task for root in micro task queue => start to perform work
  (performWorkOnRootViaSchedulerTask within scheduleTaskForRootDuringMicrotask
  function) with schedulePriority = 3 (normal level)
  + enter prepareFreshStack function
  + works(or tasks - workInProgress) are store in a stack with a fiber(current):
    - on create:
      = the pending work will first start cloning a fiber from the original 
      fiber
      = the current will store the clone in alternate field and vice versa
    - on update:
      = update tag and prop info of work
    - both:
      = will store data: state, props, child, dependencies, siblings, ref
  + flush (fiber, queue, update, lane) in concurrentQueues(mentioned in (1)) out 
  and make circular update (update.next = update) inside finishQueueingConcurrentUpdates
  + reset lane of root tree and work tree(alternate clone root tree)
3, Process work
  + enter work loop and invoke beginWork which perform on HostRoot

NOTES:
+ React is not just about state management or tree reconcilation
it also about the warning guidelines for DEVs, dev tool, profiler
and hot reload. Those are implemented within react and react-dom
+ beginWork support multiple types of tag: LazyComponent, 
FunctionComponent, Fragment, Profiler, ContextProvider, ContextConsumer,
MemoComponent,...