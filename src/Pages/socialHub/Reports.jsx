import { FaDownload, FaShare, FaPlus } from "react-icons/fa";
import { API } from "../../Api/Api";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdKeyboardArrowDown } from "react-icons/md";
import { formatDate } from "../../Utils/formatDate";
import profile from "../../assets/profile.jpg";
import { isValidUrl } from "../../Utils/validateURLs";
const Reports = () => {
  const [values, setValues] = useState({
    input_sentence: "",
    user_name: "",
    message_type: "",
  });

  const [myReports, setMyReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSeletOpen, setisSeletOpen] = useState(false);

  const getMyReports = async () => {
    try {
      const response = await axios.get(API.getMyReports);
      setMyReports(response.data.reports);
    } catch (error) {
      console.error(error);
    }
  };

  const AddReportUser = async () => {
    try {
      const response = await axios.post(API.AddReportUser, values);
      setValues({ input_sentence: "", user_name: "", message_type: "" });
      setShowForm(false);
      getMyReports();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadReport = async (reportId) => {
    try {
      const response = await axios.get(`${API.downloadReport}/${reportId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  useEffect(() => {
    getMyReports();
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between max-sm:flex-col gap-4">
        <div className=" max-sm:text-center">
          <h1 className="text-3xl font-bold text-gray-800 ">Reports</h1>
          <p className="text-gray-600 mt-2">
            Manage, download, and share your reports.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 flex items-center bg-sec-color hover:bg-main-color trans text-white py-2 px-4 rounded shadow "
        >
          <FaPlus className="mr-2" />
          {showForm ? "Hide Form" : "Add Report"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Report
          </h2>
          <div className="space-y-4">
            <div className="flex space-x-4 max-md:flex-col max-md:space-x-0  max-md:space-y-4">
              <div className="w-1/2 max-md:w-full">
                <label
                  htmlFor="user_name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Person's Name
                </label>
                <input
                  type="text"
                  id="user_name"
                  placeholder="Enter the person's name"
                  value={values.user_name}
                  onChange={(e) =>
                    setValues({ ...values, user_name: e.target.value })
                  }
                  className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-sec-color"
                />
              </div>

              <div className="w-1/2 max-md:w-full">
                <label
                  htmlFor="message_type"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Message Type
                </label>
                <div className="relative">
                  <select
                    id="message_type"
                    value={values.message_type}
                    onClick={() => setisSeletOpen(!isSeletOpen)}
                    onChange={(e) =>
                      setValues({ ...values, message_type: e.target.value })
                    }
                    className="w-full appearance-none border bg-white rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-sec-color shadow-sm"
                  >
                    <option value="" disabled>
                      Select message type
                    </option>
                    <option value="message">Message</option>
                    <option value="comment">Comment</option>
                  </select>

                  <div
                    className={`absolute inset-y-0 right-2 flex items-center pointer-events-none transform transition-transform duration-20
                     ${isSeletOpen ? "rotate-180" : "rotate-0"} `}
                  >
                    <MdKeyboardArrowDown size={25} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="input_sentence"
                className="block text-gray-700 font-medium mb-2"
              >
                Message/Comment Content
              </label>
              <textarea
                id="input_sentence"
                placeholder="Enter the content of the message or comment"
                value={values.input_sentence}
                onChange={(e) =>
                  setValues({ ...values, input_sentence: e.target.value })
                }
                className="w-full border h-32 max-md:h-24 rounded p-2 focus:outline-none focus:ring-1 focus:ring-sec-color"
              />
            </div>

            <button
              onClick={AddReportUser}
              className="bg-sec-color hover:bg-main-color trans text-white py-2 px-4 rounded transition"
            >
              Submit Report
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">My Reports</h2>
        {myReports.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {myReports.map((report, index) => (
              <li
                key={index}
                className="flex justify-between items-start py-4 max-md:flex-col max-sm:space-y-5"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={
                      isValidUrl(report.reportedUser.profilePicture)
                        ? report.reportedUser.profilePicture
                        : profile
                    }
                    alt={report.reportedUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    <p className="text-gray-900 font-semibold">
                      {report.reportedUser.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Type : </span>{" "}
                      {report.contentType}
                    </p>
                    <p className="text-main-color text-sm">
                      <span className="font-medium text-gray-600">
                        Reason :
                      </span>{" "}
                      {report.reason || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Content : </span>
                      {report.content}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {formatDate(report.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            No reports available. Add a new one to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default Reports;
