import { DAI_CONTRACT } from '../constants'
import { apiGetGasPriceKlaytn } from './api'
import { getChainData } from './utilities'

export function getDaiContract(chainId: number, web3: any) {
  const dai = new web3.eth.Contract(
    DAI_CONTRACT[chainId].abi,
    DAI_CONTRACT[chainId].address
  )
  return dai
}

export function callBalanceOf(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const dai = getDaiContract(chainId, web3)

    await dai.methods
      .balanceOf(address)
      .call(
        { from: '0x0000000000000000000000000000000000000000' },
        (err: any, data: any) => {
          if (err) {
            reject(err)
          }

          resolve(data)
        }
      )
  })
}

export function callTransfer(address: string, chainId: number, web3: any) {
  return new Promise(async(resolve, reject) => {
    const dai = getDaiContract(chainId, web3)
    const chain = getChainData(chainId).chain 
    const gasPrice = chain === 'klaytn' ? await apiGetGasPriceKlaytn(chainId): undefined;
    const gas = chain === 'klaytn' ? '80000000' : undefined

    await dai.methods
      .transfer(address, '1')
      .send({ from: address, gasPrice: gasPrice, gas: gas}, (err: any, data: any) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
  })
}
