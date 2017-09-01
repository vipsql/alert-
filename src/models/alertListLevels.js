import { groupSort, returnByIsReRender } from '../utils'

const initialState = {
  levels: []
}

export default {
  namespace: 'alertListLevels',
  state: initialState,
  reducers: {
    setLevels: function(state, { payload: { levels, isReRender } }) {
      return returnByIsReRender(state, { levels }, isReRender);
    },
    // 告警等级统计的叠加
    addLevels: function(state, { payload: { newLevels, isReRender } }) {
      let { levels } = state;
      let keys = Object.keys(newLevels);
      keys.forEach((key) => {
        levels[key] = typeof levels[key] !== 'undefined' ? levels[key] + newLevels[key] : newLevels[key]
      })

      return returnByIsReRender(state, { levels }, isReRender);
    }
  }
}