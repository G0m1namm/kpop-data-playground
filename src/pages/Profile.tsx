import React from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import useDebouncedResize from '../hooks/useDebouncedResize';
import AnimatedTextReveal from '../components/AnimatedTextReveal';
import ArtistDataInterface from '../interfaces/ArtistDataInterface';

interface ProfileProps {
	artist: ArtistDataInterface
}

const Profile = ({ artist }: ProfileProps) => {
	const { windowSize } = useDebouncedResize();
	const { width } = windowSize;

	React.useEffect(() => {

		const bioLines = new SplitType(".artist-bio__text-list", {
			types: "lines",
			lineClass: "artist-bio__text-line clip-text-reveal overflow-hidden"
		})

		const wrapper = document.querySelector(".artist-bio__text-list");

		gsap.to(".artist-bio__text-line", {
			backgroundPositionX: "0%",
			stagger: 0.5,
			ease: "Power3.InOut",
			scrollTrigger: {
				trigger: ".artist-bio__text-line",
				scrub: 1,
				start: "top 80% reverse",
				end: `+=${wrapper?.clientHeight}`,
			}
		})
	}, [width])

	return (
		<div className="artist-profile relative w-full flex min-h-screen overflow-hidden">
			<div className='artist-container items-center px-4 w-full md:max-w-[70vw] mx-auto'>
				<div className='artist-info'>
					<div className='artist-title__container relative isolate'>
						<h1>
							<AnimatedTextReveal
								target='.artist-info__title'
								charClass='artist-info__title-char'
								className='artist-info__title inline-block my-[20vh] md:my-[30vh] text-[clamp(60px,12vw,12vw)] leading-[clamp(60px,12vw,12vw)] whitespace-pre-wrap bg-blend-difference'
							>
								{artist.title}
							</AnimatedTextReveal>
						</h1>
						<img
							className='artist-info__group-image aspect-[3/4] object-cover max-w-[clamp(400px,32vw,900px)] absolute -right-[calc(clamp(400px,32vw,900px)/2)] top-[50%] -translate-y-[50%] -z-10'
							src={require(`../assets/${artist.assets_folder_name}/${artist.main_group_image}`)}
							alt={artist.title}
						/>
					</div>

					<div className='artist-bio__wrapper pt-[30vh] md:pt-[40vh] xl:pt-[40vh]'>
						<p className='artist-bio__text-list whitespace-pre-line font-semibold tracking-wide text-[clamp(28px,4vw,8vw)]'>{artist.bio}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
