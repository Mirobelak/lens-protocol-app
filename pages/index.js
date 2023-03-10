import {useState, useEffect} from 'react'
import {client, recommendProfiles, challenge, authenticate, apolloClient} from '../api'
import { ethers } from 'ethers'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {

  const [profiles, setProfiles] = useState([])
  const [address, setAddress] = useState()
  const [token, setToken] = useState()


  const fetchProfiles = async () => {
    const result = await client.query(recommendProfiles).toPromise()
    setProfiles(result.data.recommendedProfiles)
    
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    /* when the app loads, check to see if the user has already connected their wallet */
    checkConnection()
  }, [])
  async function checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    if (accounts.length) {
      setAddress(accounts[0])
    }
  }
  async function connect() {
    /* this allows the user to connect their wallet */
    const account = await window.ethereum.send('eth_requestAccounts')
    if (account.result.length) {
      setAddress(account.result[0])
    }
  }

  // make me function to disconnect wallet

  async function disconnect() {
    /* this allows the user to disconnect their wallet */
    const account = await window.ethereum.send('eth_requestAccounts')
    if (account.result.length) {
      setAddress("")
    }
  }

  async function login() {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await apolloClient.query({
        query: challenge,
        variables: { address }
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(challengeInfo.data.challenge.text)
      /* authenticate the user */
      const authData = await apolloClient.mutate({
        mutation: authenticate,
        variables: {
          address, signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { data: { authenticate: { accessToken }}} = authData
      console.log({ accessToken })
      setToken(accessToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }

  return (
    <div>
            {  !address && <button onClick={connect}>Connect</button>}
            {
        address && !token && (
          <div onClick={login}>
            <button>Login</button>
          </div>
        )
      }
      {
        address && token && <h2>Successfully signed in!</h2>
      }
      {address && <button onClick={disconnect} >Disconnect</button>}
      <h1>Recommended Profiles</h1>
      <ul style={{}}>
        {profiles.map((profile) => (
          <Link key={profile.id} href={`/profile/${profile.id}`}>
            <h2>{profile.handle}</h2>
            <p>{profile.bio}</p>  
            {profile.picture ? ( <Image src={profile.picture.original.url} alt="profile-picture" width={60} height={60} /> ) : (<div>no image</div>)}
          </Link>
        ))}
      </ul>
      </div>
      
  )
}
