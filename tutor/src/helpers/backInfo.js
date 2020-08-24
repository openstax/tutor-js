import { TransitionStore } from '../flux/transition';

const backInfo = () => {
  // Gets route to last path that was not the same as the current one
  // See TransitionStore for more detail.
  const historyInfo = TransitionStore.getPrevious();
  const text = historyInfo !== null && !!historyInfo.name ? `Back to ${historyInfo.name}` : 'Back';
  const to =  historyInfo != null && !!historyInfo.path ? historyInfo.path : undefined;

  return {
    text,
    to,
  };
};


export default backInfo;
