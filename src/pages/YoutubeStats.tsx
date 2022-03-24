import React, { forwardRef, LegacyRef } from 'react'
import CardCover from '../assets/blackpink-cover.webp'
import Counter from '../components/Counter';

interface YoutubeStatsProps {
}
export const YoutubeStats = forwardRef((props, ref: LegacyRef<HTMLDivElement>) => {
		return (
			<div ref={ref} id="youtube-counts-section" className="mt-24 md:mt-52 py-5 sm:py-10 space-y-16 md:space-y-32">
				<div className="youtube-subscribers text-center space-y-7 md:space-y-12">
					<h2 className="text-xl md:text-3xl font-light">Total Youtube subscribers</h2>
					<Counter className="text-7xl" from={10000} to={60200000000} />
				</div>
				<div className="youtube-watched-videos space-y-10">
					<h2 className="text-xl md:text-3xl font-light">Most watched videos</h2>
					<ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-y-12">
						{Array(4).fill(0).map(() => <VideosInfo />)}
					</ul>
				</div>
			</div>
		)
})

export default YoutubeStats;

export function VideosInfo() {
	return (
		<li className="grid space-y-6 font-light">
			<Counter className="text-xl" from={0} to={1555314556} />
			<figure className="space-y-6">
				<img
					className="aspect-video rounded-xl object-cover"
					src={CardCover}
				/>
				<caption className="grid text-left space-y-2">
					<span className="text-md md:text-lg 2xl:text-xl uppercase">Blackpink (ddu ddu ddu du) M/V</span>
					<span className="text-md md:text-lg 2xl:text-xl">Published: 06/2018</span>
				</caption>
			</figure>
		</li>
	)
}

