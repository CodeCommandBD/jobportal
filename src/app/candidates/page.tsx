
import React from 'react'
import { Metadata } from 'next'
import CandidatesContent from './CandidatesContent'

export const metadata: Metadata = {
  title: 'Top Candidates | JobPortal',
  description: 'Explore our curated list of skilled professionals ready to join your team.',
}

const CandidatesPage = () => {
  return <CandidatesContent />
}

export default CandidatesPage
