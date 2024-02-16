import { useState, useEffect } from "react";
import "../App.css";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import PreviewDocument from "../DocPreview";
import NavbarHandler from "../Components/Navbar/Navbar";
import Hero from "../Components/Hero/Hero";

function RecentDocs() {
  let docIDX = 0;
  const docRef = collection(db, "documents");
  const q = query(docRef, orderBy("CreatedAt", "desc"));
  const [docs] = useCollectionData(q);
  return (
    <div>
      {docs && docs.map((doc) => <PreviewDocument key={docIDX++} doc={doc} />)}
    </div>
  );
}

function Home() {
  const currentTheme = localStorage.getItem("currentTheme");
  const [theme, setTheme] = useState(currentTheme ? currentTheme : "dark");
  useEffect(() => {
    localStorage.setItem("currentTheme", theme);
  }, [theme]);

  return (
    <>
      <div className={"container " + theme + " home"}>
        <NavbarHandler theme={theme} setTheme={setTheme} />
        <Hero />
        <h1 className="title">Recently Uploaded</h1>
        <RecentDocs />
      </div>
    </>
  );
}

export default Home;
