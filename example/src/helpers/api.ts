import axios, { AxiosInstance } from 'axios'
import { IAssetData, IGasPrices, IParsedTx } from './types'
import { getChainData } from './utilities'

const api: AxiosInstance = axios.create({
  baseURL: 'https://ethereum-api.xyz',
  timeout: 30000, // 30 secs
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export async function apiGetAccountAssets(
  address: string,
  chainId: number
): Promise<IAssetData[]> {
  if (getChainData(chainId).chain === 'klaytn'){
    return await apiGetAccountAssetsKlaytn(address, chainId)
  }
  const response = await api.get(
    `/account-assets?address=${address}&chainId=${chainId}`
  )
  const { result } = response.data
  return result
}

export async function apiGetAccountAssetsKlaytn(
  address: string,
  chainId: number
): Promise<IAssetData[]>{
  
  const url = chainId === 8217 ? "https://public-node-api.klaytnapi.com/v1/cypress" : "https://public-node-api.klaytnapi.com/v1/baobab" ; 
  const response = await axios.post(url, {
    'jsonrpc': '2.0',
    'id': 0,
    'method': 'klay_getBalance',
    'params': [
      address, 
      'latest'
    ]
  })
  
  const result: IAssetData = {
    symbol: "KLAY",
    name: "Klaytn",
    decimals: "18",
    contractAddress: "",
    balance: response.data.result
  }
  return [result]
}

export async function apiGetGasPriceKlaytn(
  chainId: number,
): Promise<string> {
  const url = chainId === 8217 ? "https://public-node-api.klaytnapi.com/v1/cypress" : "https://public-node-api.klaytnapi.com/v1/baobab" ; 
  const response = await axios.post(url, {
    'jsonrpc': '2.0',
    'id': 0,
    'method': 'klay_gasPrice',
  })
  const { result } = response.data
  return result
}

export async function apiGetAccountTransactions(
  address: string,
  chainId: number
): Promise<IParsedTx[]> {
  const response = await api.get(
    `/account-transactions?address=${address}&chainId=${chainId}`
  )
  const { result } = response.data
  return result
}

export const apiGetAccountNonce = async (
  address: string,
  chainId: number
): Promise<string> => {
  const response = await api.get(
    `/account-nonce?address=${address}&chainId=${chainId}`
  )
  const { result } = response.data
  return result
}

export const apiGetGasPrices = async (): Promise<IGasPrices> => {
  const response = await api.get(`/gas-prices`)
  const { result } = response.data
  return result
}
