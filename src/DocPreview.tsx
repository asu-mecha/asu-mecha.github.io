import { format } from "date-fns";

function PreviewDocument(props: { doc: any }) {
  const { CourseCode, CourseName, CreatedAt, Title, fileID, URL } = props.doc;
  const thumbnailLink =
    "https://drive.google.com/thumbnail?sz=w130&id=" + fileID;

  const image = new Image();
  image.src = thumbnailLink;
  image.onload = () => {
    console.log("Image loaded");
  };

  return (
    <a target="_blank" rel="noreferrer" className="preview" href={URL}>
      <div className="aspectwrapper">
        <img src={thumbnailLink} alt={Title} />
      </div>
      <div className="overlay">
        <h2 className="title">{Title}</h2>
        <h2 className="course">{"Course: " + CourseCode + "-" + CourseName}</h2>
        <h2 className="date">
          {"Uploaded: " + format(CreatedAt.toDate(), "MMM dd, yyyy hh:mm")}
        </h2>
      </div>
    </a>
  );
}

export default PreviewDocument;
