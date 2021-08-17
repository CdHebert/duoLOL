// React
import { Container } from "@material-ui/core";
import React from "react";
import MatchingCard from "../components/MatchingCard";
import Chat from '../components/Chat';

// DuoFinder
function DuoFinder() {
	return (
		<Container>
			<MatchingCard />
			{/* //! move to proper area */}
			{/* <Chat /> */}
		</Container>
	);
}

// export DuoFinder
export default DuoFinder;
