import axios from 'axios'

export let saveflowData = function(flowData) {
  let data = axios({
    url: '/flow/addflow',
    method: 'post',
    data: flowData
  })
  return data
}
