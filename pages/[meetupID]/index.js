import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "@/components/meetups/MeetupDetail";

function MeetupDetails(props) {
	return (
		<>
			<Head>
				<title>{props.meetupData.title} details</title>
				<meta name="description" content={props.meetupData.description}></meta>
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</>
	);
}

export async function getStaticPaths() {
	const client = await MongoClient.connect("mongodb+srv://user1:qwerty123@cluster0.hs48clo.mongodb.net/meetups?retryWrites=true&w=majority");
	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: false,
		paths: meetups.map((meetup) => ({
			params: {
				meetupID: meetup._id.toString(),
			},
		})),
	};
}

export async function getStaticProps(context) {
	//fetch data for single meetup
	const { meetupID } = context.params;

	const client = await MongoClient.connect("mongodb+srv://user1:qwerty123@cluster0.hs48clo.mongodb.net/meetups?retryWrites=true&w=majority");
	const db = client.db();

	const meetupsCollection = db.collection("meetups");

	const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupID) });

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
