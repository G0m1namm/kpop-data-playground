import React, { useEffect } from 'react';
import { useMatch, useNavigate } from '@tanstack/react-location';
import useSessionStorage from '../hooks/useSessionStorage';
import ArtistSubMenu from '../components/ArtistSubMenu';
import AnimatedText from '../components/AnimatedText';
import { Profile, YoutubeStats } from './';
import { useSpotifyArtist } from '../hooks/useSpotify';
import ScrollSpy from "react-ui-scrollspy";
import { AnimatePresence, motion, Variants } from 'framer-motion';

export default function ArtistHome() {
  const [artistId, _] = useSessionStorage("artist", "");
  const navigate = useNavigate();
  const { params: { artistId: artistGUID, artistName } } = useMatch();

  const { data, isLoading } = useSpotifyArtist(artistGUID);
 
  const container: Variants = {
      visible: {
        scaleY: 1,
          transition: {
              staggerChildren: 0.05,
              duration: 0.5
          }
      },
      hidden: {
        scaleY: 0,
        transition: {
            staggerChildren: 0.05,
            duration: 0.4
        }
    }
  }

  useEffect(() => {
    if(artistId === "/") navigate({to: "/artists"});
  }, [artistId, navigate])

  return (
    <div id="artistPage">
      <ArtistSubMenu artistId={artistId}/>
      <AnimatePresence exitBeforeEnter>
        {!data && <motion.div
          key="loading"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed w-full h-screen bg-cream dark:bg-black inset-0 whitespace-pre-line flex flex-col place-content-center items-center text-[6vw] p-20 uppercase"
          variants={container}
          >
          </motion.div>}
        {data && <motion.div
          key="content-section"
          className="pt-[136px] px-4 md:px-16 2xl:px-20"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
        >
          <Profile artist={data!} />
          <YoutubeStats />
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}
