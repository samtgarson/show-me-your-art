import { AnimatePresence } from 'framer-motion'
import React, { FC, useState } from 'react'
import { AboutModal } from '../about-modal'
import { SuggestArtistModal } from '../suggest-an-artist/modal'
import { NavBar, NavItem } from './nav-bar'

type Modals = 'about' | 'suggest'

export const LandingNav: FC = () => {
  const [modal, setModal] = useState<Modals | null>(null)
  const ModalButton = ({ mod, title }: { mod: Modals, title: string }) => (
    <a onClick={() => setModal(modal === mod ? null : mod)}>
      {modal === mod ? 'Close' : title}
    </a>
  )

  return (
    <>
      <NavBar
        title={<h1 className='sm:hidden'>Show me your</h1>}
        items={
          <>
            <NavItem>
              <ModalButton title='About' mod='about' />
            </NavItem>
            <NavItem>
              <ModalButton title='Suggest an artist' mod='suggest' />
            </NavItem>
            {/* <NavItem>Suggest an artist</NavItem> */}
          </>
        }
      />
      <AnimatePresence>
        {modal === 'about' && <AboutModal />}
        {modal === 'suggest' && <SuggestArtistModal />}
      </AnimatePresence>
    </>
  )
}
