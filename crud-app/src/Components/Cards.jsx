import axios from 'axios';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { baseUrl } from '../App';

const Cards = ({ item, data, setData }) => {

    const [Open, setOpen] = useState(false)
    const titleInputRef = useRef(null);
    const bodyInputRef = useRef(null);


    const updateStory = async (e) => {
        e.preventDefault()
        await axios.put(`${baseUrl}/api/v1/story/${item?.id}`, {
            title: titleInputRef.current?.value,
            text: bodyInputRef.current?.value
        }).then((response) => {
            toast.success(response?.data?.message)

            let updatedItem = data.find((element) => { return element.id === item.id })

            updatedItem.metadata.title = titleInputRef.current?.value
            updatedItem.metadata.text = bodyInputRef.current?.value

            setOpen(false)
        }).catch((error) => {
            toast.error(error.response?.data?.message || error?.message)
            setOpen(false)
        })
    }


    const DeleteStory = async () => {
        await axios.delete(`${baseUrl}/api/v1/story/${item?.id}`).then((response) => {
            toast.success(response?.data?.message)
            setData(
                data?.filter((i) => {
                    return i?.id !== item?.id
                })
            )
        }).catch((error) => {
            toast.error(error.response?.data?.message || error?.message)
        })
    }

    return (
        <>
            <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex flex-col items-center border-gray-300 border p-4 rounded-lg">
                    <div className="flex-grow">
                        <h2 className="text-gray-800 text-xl font-medium">{item?.metadata?.title}</h2>
                        <p className="text-gray-600 text-lg">{item?.metadata?.text}</p>
                    </div>
                    <div className="flex items-center my-2 justify-center w-full">
                        <button onClick={() => setOpen(true)} className="w-1/4 p-1 m-2 rounded-lg text-white bg-blue-700 px-4 font-semibold hover:bg-blue-900 hover:trandform ease-in-out duration-300"> Edit </button>
                        <button onClick={DeleteStory} className="w-1/4 p-1 m-2 rounded-lg text-white bg-red-500 px-4 font-semibold hover:bg-red-900 hover:trandform ease-in-out duration-300"> Delete </button>

                    </div>
                </div>
            </div>

            {Open ?
                <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">

                                        <form onSubmit={updateStory}>

                                            <div className="lg:w-full md:w-2/3 mx-auto">
                                                <div className="flex flex-wrap -m-2">
                                                    <div className="p-2 w-full">
                                                        <div className="relative">
                                                            <label htmlFor="titleInput" className="leading-7 text-sm text-gray-600">Title</label>
                                                            <input defaultValue={item.metadata?.title} id="titleInput" ref={titleInputRef} type="text" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                                                        </div>
                                                    </div>
                                                    <div className="p-2 w-full">
                                                        <div className="relative">
                                                            <label htmlFor="bodyInput" className="leading-7 text-sm text-gray-600">Decription</label>
                                                            <textarea defaultValue={item.metadata?.text} id="bodyInput" ref={bodyInputRef} className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="justify-evenly px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-4">
                                                <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900 sm:ml-3 sm:w-auto">Edit Story</button>
                                                <button onClick={() => setOpen(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div> : null}

        </>


    )
}

export default Cards