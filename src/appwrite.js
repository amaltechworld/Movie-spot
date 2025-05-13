import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // passing from where

    try {
        // 1. Use appwrite SDK to check if the searchTerm exist in the database
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("searchTerm", searchTerm)]
        );

        // 2. If it does, update the count
        if (result.documents.length > 0) {
            const doc = result.document[0];

            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1,
                }
            );

        //3. If it doesn't, create a new document with searchTerm and count as 1.
        } else {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url:`https://image.tmdb.org/t/p/w500/${movie.poster_path}`, 
                }
            );
        }
    } catch (error) {
        console.error(error);
    }

};

    // fetch top searched movies from the documentList
    export const getTrendingMovies = async () => {
        try {
            const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
                Query.limit(5),
                Query.orderDesc('count')
            ])
            return result.documents;
        } catch (error) {
            console.error(`Fetching trending movie went wrong ${error}`);
            
        }
    }