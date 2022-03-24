import React, { LegacyRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import { motion, useAnimation, Variants } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSpotifyArtistTopTracks } from '../hooks/useSpotify';
import { after } from 'underscore';
import SplitType from 'split-type'
import { useInView } from 'react-intersection-observer';
import useDebouncedResize from '../hooks/useDebouncedResize';

import tracksJSON from '../api/topTracks.json';
interface ProfileProps {
	artist: SpotifyApi.SingleArtistResponse,
}

interface CustonImageObject extends SpotifyApi.ImageObject {
	ratio: string, 
	position: string
}
const Profile = ({ artist }: ProfileProps) => {
	const sectionRef: LegacyRef<HTMLDivElement> = useRef(null);
	const [allImagesLoaded, setAllImagesLoaded] = useState(false);
	//const { data: tracksData } = useSpotifyArtistTopTracks(artist.id);
	const { windowSize } = useDebouncedResize();
	const { width, height } = windowSize;
	const scrollTimeline = gsap.timeline({paused: true});
	const sectionId = "profile-section";
	let hasScrolled = false;

	// Create a custom array of objects with additional info from SpotifyApI Artist top tracks
	/* const tracksJSON = useMemo(() => {
		if(typeof tracksData === "undefined") return [];
		return tracksData.tracks.reduce((acc: CustonImageObject[], curr) => {
			const random = Math.floor(Math.random() * 3) + 1;
			const ratios = ["aspect-[9/12] max-w-[400px]", "aspect-square max-w-[400px]", "aspect-video max-w-[700px]"];
			const translations = ["-translate-y-[25%]", "translate-y-[40%]", "-translate-y-[50%]"]
			const ratio = ratios[random];
			const position = translations[random];

			const customImageObject = {
				...curr.album.images[0],
				ratio,
				position
			}
			acc.push(customImageObject);
			return acc;
		}, [])
	}, [tracksData]) */

	const goToSection = (section: Element, anim: GSAPTimeline) => {
		if(hasScrolled) {
			gsap.to(window, {
				scrollTo: {
					y: section,
					autoKill: false,
				},
				duration: 1
			});
			if(anim) { anim.restart(); }
		}
	}

    const addAnimation = () => {
			const gallery = sectionRef.current!;
			const totalScroll = gallery.scrollWidth - window.innerWidth;
			const artistName = gallery.getElementsByClassName("artist-name");
			let proxy = { skew: 0 };
			let skewSetter = gsap.quickSetter(artistName, "skewX", "deg");
			let clamp = gsap.utils.clamp(-20, 20);
        
			scrollTimeline.add(gsap.to(gallery, {
				x: () => -totalScroll,
				ease: "none",
				scrollTrigger: {
					id: sectionId,
					trigger: gallery,
					toggleActions: "play complete none pause",
					pin: true,
					scrub: 1.2,
					start: "center center",
					end: () => `+=${totalScroll}`,
					onEnter: () => goToSection(gallery, scrollTimeline),
						onUpdate: self => {
							let skew = clamp(self.getVelocity() / -300);
							if (Math.abs(skew) > Math.abs(proxy.skew)) {
								proxy.skew = skew;
								gsap.to(proxy, {
									skew: 0,
									duration: 0.8,
									ease: "power3.easeInOut",
									overwrite: true,
									onUpdate: () => skewSetter(proxy.skew)
								})
							}
						}
					}
			}
			))

			ScrollTrigger.refresh();
    }

    const removeAnimation = () => {
			scrollTimeline.kill();
			ScrollTrigger.getById(sectionId).kill();
    }

    const onComplete = after(tracksJSON.length, () => {
			setAllImagesLoaded(true);
    })

    useLayoutEffect(() => {        
			addAnimation();
			return () => {
				removeAnimation();
			}
		}, [allImagesLoaded, sectionRef.current, tracksJSON.length, width, height])
  
    return (
			<motion.div ref={sectionRef} id={sectionId} className="artist-profile relative w-fit flex">
				<motion.div className="artist-profile_gallery flex flex-nowrap ml-[5vw] 2xl:ml-[15vw]">
					<AnimatedHeading name={artist.name}/>
					{tracksJSON.length > 0 && tracksJSON.map((image, index) => {
						return (
							<motion.section 
								key={`section-image-${index}`}
								className={classnames("artist-profile_gallery-section flex shrink-0 px-[100px] perspective-screen overflow-hidden")}
							>
								<ArtistImage
									className="h-fit inline-flex"
									ratioClass={image.ratio}
									//positionClass={image.position}
									positionClass={"aspect-[9/12] max-w-[400px]"}
									imageData={image} 
									name={artist?.name}
									onComplete={onComplete}
								/>
							</motion.section>
						)
					})}
				</motion.div>
			</motion.div>
    )
}

export default Profile;

interface ArtistImageProps {
	ratioClass?: string | undefined,
	positionClass?: string | undefined,
	name: string | undefined,
	imageData: SpotifyApi.ImageObject | undefined,
	className?: string | undefined,
	onComplete: Function
}

const ArtistImage = ({ ratioClass = "aspect-square max-w-[400px]", positionClass = "", name, imageData, className, onComplete }: ArtistImageProps) => {
	const controls = useAnimation();
	const [ref, inView] = useInView({ threshold: 0, triggerOnce: true, delay: 100 });
	const squareVariants: Variants = {
		visible: { clipPath: "inset(0px 0px 0px 0px)", translateZ: 50, transition: { duration: 1, easings: [0.77, 0, 0.175, 1] } },
		hidden: { clipPath: "inset(0px 0px 0px 600px)", translateZ: -300 }
	};
	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	return (
		<motion.img
			ref={ref}
			src={imageData?.url}
			alt={`${name} cover`}
			onLoad={() => onComplete()}
			onError={() => onComplete()}
			animate={controls}
			initial="hidden"
			variants={squareVariants}
			className={classnames("object-cover origin-center backface-visible inline-flex", className, ratioClass, positionClass)}
		/>
	)
}

const AnimatedHeading = ({ name }:{name: string}) => {

	useEffect(() => {
		const children = new SplitType(".artist-name", {
			types: "lines",
			lineClass: "name-line overflow-hidden"
		})

		const parent = new SplitType(".name-line", {
			types: "chars",
			lineClass: "name"
		})

		gsap.fromTo(parent.chars, {
			yPercent: 100,
			opacity: 0
		},{
			yPercent: 0,
			opacity: 1,
			ease: "power3",
			stagger: 0.05,
			delay: 0.4
		})
	}, [])

	return (
		<motion.section 
			className={classnames("artist-profile_name artist-profile_gallery-section z-[1] flex shrink-0 place-content-center items-center mix-blend-difference min-w-[100vw]")}
		>
			<h1 className="artist-name text-[18vw] text-center">{name}</h1>
		</motion.section>
	)
}
