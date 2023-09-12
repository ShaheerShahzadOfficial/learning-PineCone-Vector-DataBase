import { useState, useRef, useEffect, useId } from "react";
import axios from "axios";
import "./App.css";
import Loader from "./assets/loader.gif"
import toast from 'react-hot-toast';
import Cards from "./Components/Cards";

export const baseUrl = import.meta.env.VITE_BASEURL

function App() {
  const titleInputRef = useRef(null);
  const bodyInputRef = useRef(null);
  const SearchInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const id = useId()



  useEffect(() => {
    getAllStories();
  }, []);

  const getAllStories = async () => {
    setIsLoading(true);
    await axios.get(`${baseUrl}/api/v1/stories?queryText=${" "}`).then((resp) => {
      setIsLoading(false);
      setData(resp.data?.response?.matches)
      // toast.success(resp?.data?.message)
      console.log(resp.data?.response?.matches)
    }).catch((error) => {
      setIsLoading(false);
      // toast.error(error.response?.data?.message || error?.message)

    })

  }

  const postStory = async (event) => {
    event.preventDefault();
    if (titleInputRef.current.value?.trim() !== "" && bodyInputRef.current.value !== "") {
      try {
        setIsLoading(true);

        await axios.post(`${baseUrl}/api/v1/story`, {
          title: titleInputRef.current.value,
          text: bodyInputRef.current.value,
        }).then((response) => {
          toast.success(response?.data?.message)
          setIsLoading(false);
          event.target.reset();
        }).catch((error) => {
          toast.error(error.response?.data?.message || error?.message)

          console.log("error", error, "error")
          setIsLoading(false);

        })

      } catch (e) {
        console.warn(e);

      }
    } else {
      toast.error("All Fields Are Required.")

    }


  };


  const search = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    await axios.get(`${baseUrl}/api/v1/stories?queryText=${SearchInputRef?.current?.value || " "}`).then((resp) => {
      setIsLoading(false);
      setData(resp.data?.response?.matches)
      // toast.success(resp?.data?.message)
      console.log(resp.data?.response)
    }).catch((error) => {
      setIsLoading(false);
      // toast.error(error.response?.data?.message || error?.message)

    })

  }


  return (
    <div>
      <h1 className="font-mono text-2xl	font-bold	italic subpixel-antialiased">Social Stories</h1>

      <form onSubmit={search}>

        <div className="lg:w-1/2 md:w-2/3 mx-auto mb-10">
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <div className="relative flex items-center justify-center w-full bg-gray-100 bg-opacity-50 rounded-full border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-1 leading-8 transition-colors duration-200 ease-in-out">
                <input id="SearchInput" placeholder="Search Here" ref={SearchInputRef} type="text" className="w-[90%] bg-transparent outline-none px-6" />
                <button type="submit" className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded-full	text-lg">Search</button>
              </div>
            </div>
          </div>
        </div>

      </form>


      <h1 className="font-mono text-2xl mb-6	font-bold	italic subpixel-antialiased">Create A New Story</h1>


      <form onSubmit={postStory}>

        <div className="lg:w-1/2 md:w-2/3 mx-auto">
          <div className="flex flex-wrap -m-2">
            <div className="p-2 w-full">
              <div className="relative">
                <label htmlFor="titleInput" className="leading-7 text-sm text-gray-600">Title</label>
                <input id="titleInput" ref={titleInputRef} type="text" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>
            </div>
            <div className="p-2 w-full">
              <div className="relative">
                <label htmlFor="bodyInput" className="leading-7 text-sm text-gray-600">Decription</label>
                <textarea id="bodyInput" ref={bodyInputRef} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="mt-6 flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Post</button>

      </form>

      <br />
      <hr />

      {isLoading && <div className="flex items-center justify-center w-full">
        <img alt="loading ... " src={Loader} />
      </div>}


      <div className="flex flex-col	items-center justify-center ">
        {
          data?.map((item) => (
            <Cards item={item} key={item?.id} setData={setData} data={data} />
          ))
        }


      </div>

    </div>
  );
}

export default App;