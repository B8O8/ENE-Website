import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import "./Library.css";

const Library = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const baseUrl = import.meta.env.VITE_FILE_URL; // Update this to match your backend server URL
  
    // Fetch library files
    const fetchLibraryFiles = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/library/user");
        const updatedFiles = response.map((file) => ({
          ...file,
          file_url: file.file_url.startsWith("http")
            ? file.file_url
            : `${baseUrl}${file.file_url}`, // Prepend base URL if not absolute
        }));
        console.log(updatedFiles);
        setFiles(updatedFiles);
      } catch (error) {
        toast.error("Failed to fetch library files.");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchLibraryFiles();
    }, []);
  
    return (
      <div className="library-container p-4">
        <h3 className="text-center mb-4">Library</h3>
  
        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p>No files available in the library.</p>
        ) : (
          <div className="row">
            {files.map((file) => (
              <div key={file.id} className="col-md-4 col-sm-6 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title">{file.title}</h5>
                    <p className="card-text">{file.description}</p>
                    <a
                      href={file.file_url}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View/Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  

export default Library;
// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import apiService from "../../services/apiService";

// const Library = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null); // Track the selected file for preview
//   const baseUrl = import.meta.env.VITE_FILE_URL; // Update this to match your backend server URL

//   // Fetch library files
//   const fetchLibraryFiles = async () => {
//     setLoading(true);
//     try {
//       const response = await apiService.get("/library/user");
//       const updatedFiles = response.map((file) => ({
//         ...file,
//         file_url: file.file_url.startsWith("http")
//           ? file.file_url
//           : `${baseUrl}${file.file_url}`, // Prepend base URL if not absolute
//       }));
//       setFiles(updatedFiles);
//     } catch (error) {
//       toast.error("Failed to fetch library files.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLibraryFiles();
//   }, []);

//   return (
//     <div className="library-container p-4">
//       <h3 className="text-center mb-4">Library</h3>

//       {loading ? (
//         <p>Loading files...</p>
//       ) : files.length === 0 ? (
//         <p>No files available in the library.</p>
//       ) : (
//         <div className="row">
//           <div className="col-md-4">
//             <div className="list-group">
//               {files.map((file) => (
//                 <button
//                   key={file.id}
//                   className={`list-group-item list-group-item-action ${
//                     selectedFile?.id === file.id ? "active" : ""
//                   }`}
//                   onClick={() => setSelectedFile(file)}
//                 >
//                   {file.title}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="col-md-8">
//             {selectedFile ? (
//               <div>
//                 <h5>{selectedFile.title}</h5>
//                 <p>{selectedFile.description}</p>
//                 <iframe
//                   src={selectedFile.file_url}
//                   title={selectedFile.title}
//                   style={{
//                     width: "100%",
//                     height: "600px",
//                     border: "none",
//                   }}
//                 ></iframe>
//               </div>
//             ) : (
//               <p>Select a file to view.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Library;
