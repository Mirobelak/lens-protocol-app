import {useRouter} from 'next/router'
import { getProfiles, client } from '../../api'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ABI from '../../abi.json'
import { ethers } from 'ethers'

const address = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"

export default function profile() {

    const [profile, setProfile] = useState()
    const router = useRouter()
    const {id} = router.query

    async function fetchProfile() {
       try {
        const response = await client.query(getProfiles, {id}).toPromise()
        console.log(response)
        setProfile(response.data.profiles.items[0])
       } 
       
       catch (error) {
              console.log(error)
       }
    }

    async function connect() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts[0])
    }

    async function follow() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(address, ABI, signer)
        try {
            const tx = await contract.follow([id], [0x0])
            await tx.wait()
            console.log("tx confirmed")
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(!id) return
        fetchProfile()
    }, [id])
    return (
        <div>
            <button onClick={connect}>Connect</button>
            <button onClick={follow}>Follow</button>
           <Image src={profile
              ? profile.picture.original.url
                : "https://via.placeholder.com/150"} alt="profile-picture" width={60} height={60} />
            <h1>{profile ? profile.handle : "loading"}</h1>
            <p>{profile ? profile.bio : "loading"}</p>
            <p>Followers: {profile?.stats.totalFollowers}</p>
        </div>

    )
}
