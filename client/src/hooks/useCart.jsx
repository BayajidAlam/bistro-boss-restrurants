import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { AuthContext } from '../providers/AuthProvider'

const useCart = (email) => {
  const { user }  = useContext(AuthContext);
}