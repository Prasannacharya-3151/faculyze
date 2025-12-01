import React from "react";

export default function UploadedNotes() {
 
  const uploadedNotes = [
    {
      id: 1,
      title: "Physics Mechanics Notes",
      subject: "Physics",
      group: "Science",
      type: "Notes",
      year: "1st PUC",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Organic Chemistry Assignment",
      subject: "Chemistry",
      group: "Science",
      type: "Assignment",
      year: "2nd PUC",
      date: "2024-01-14",
    },
    {
      id: 3,
      title: "Calculus Question Paper",
      subject: "Mathematics",
      group: "Science",
      type: "Question Paper",
      year: "1st PUC",
      date: "2024-01-13",
    },
    {
      id: 4,
      title: "Biology Syllabus",
      subject: "Biology",
      group: "Science",
      type: "Syllabus",
      year: "2nd PUC",
      date: "2024-01-12",
    },
  ];

  const handleEdit = (id: number) => {
    console.log("Edit note with id:", id);
};

  const handleDelete = (id: number) => {
    console.log("Delete note with id:", id);
};

  return (
    <div className="w-full p-6">
      {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">Uploaded Notes</h1> */}
      
   
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
     
        <div className="overflow-x-auto">
          <table className="w-full">
          
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Title</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Subject</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Group</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Year</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-12 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
         
            <tbody className="divide-y divide-gray-200">
              {uploadedNotes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">{note.title}</td>
                  <td className="py-4 px-6 text-gray-600">{note.subject}</td>
                  <td className="py-4 px-6 text-gray-600">{note.group}</td>
                  <td className="py-4 px-6 text-gray-600">{note.type}</td>
                  <td className="py-4 px-6 text-gray-600">{note.year}</td>
                  <td className="py-4 px-6 text-gray-600">{note.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(note.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

   
      {uploadedNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes uploaded yet.</p>
          <p className="text-gray-400 mt-2">Upload your first notes to get started.</p>
        </div>
      )}
    </div>
  );
}