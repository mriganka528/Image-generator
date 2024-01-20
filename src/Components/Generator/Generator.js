import React, { useRef, useState } from 'react'
import Styles from './Generator.module.css'
import img from '../../Assets/ai.webp';
import OpenAI from 'openai';
import { saveAs } from 'file-saver';
function Generator() {
    const apiKEY = process.env.REACT_APP_API_KEY2;
    const openai = new OpenAI({
        apiKey: apiKEY,
        dangerouslyAllowBrowser: true
    });
    const [imageURL, setImageURL] = useState("/");
    const [loading, setLoading] = useState(false);
    const inpRef = useRef(null);
    const generate = async () => {
        if (inpRef.current.value === "") {
            alert("you must provide a prompt");
            return 0;
        }
        setLoading(true);
        try {
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: "a white siamese cat",
                n: 1,
                size: "512x512",
            });
            setImageURL(response.data.data[0].url);
            setLoading(false)
        } catch (error) {
            console.log(error)
            if (error.status === 400) {
                setImageURL("https://media0.giphy.com/media/RWUqVYucDBD4A/giphy.webp?cid=ecf05e47shpq3d68hfx1xmxxhrtkwjkvhvo3fz0rvgw021xq&ep=v1_gifs_search&rid=giphy.webp&ct=g");
                alert("Sorry, API key limit reached");
                setLoading(false);
                setTimeout(() => {
                    setImageURL('/');
                }, 4000);
            }
            else {
                setImageURL("https://media0.giphy.com/media/RWUqVYucDBD4A/giphy.webp?cid=ecf05e47shpq3d68hfx1xmxxhrtkwjkvhvo3fz0rvgw021xq&ep=v1_gifs_search&rid=giphy.webp&ct=g");
                alert("Internal server error");
                setLoading(false);
                setTimeout(() => {
                    setImageURL('/');
                }, 4000);

            }
        }
    };
    const downloadImg = () => {
        let dwURL = (imageURL === '/') ? img : imageURL;
        saveAs(dwURL, 'image.png');
    }

    return (
        <>
            <div className={Styles.main}>
                <div className={Styles.heading}>
                    <h1>AI image generator</h1>
                </div>
                <div className={Styles.inputGroup}>
                    <input placeholder="Give a description of the image " ref={inpRef} type="text" id="input-field" />
                    <div className={Styles.buttonDiv}>
                        <button className={Styles.btn} onClick={() => { generate() }}><span>Generate</span></button>
                    </div>
                </div>
                <div className={Styles.generated}>
                    <h1>Images</h1>
                    <div>
                        <img src={imageURL === '/' ? img : imageURL} alt="" />
                        <div className={loading === true ? Styles.loader_full : Styles.loader}></div>
                    </div>
                    <div className={Styles.downDiv}>
                        <button onClick={downloadImg} title='Download image' >
                            <svg
                                viewBox="0 0 256 256"
                                height="32"
                                width="38"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M74.34 85.66a8 8 0 0 1 11.32-11.32L120 108.69V24a8 8 0 0 1 16 0v84.69l34.34-34.35a8 8 0 0 1 11.32 11.32l-48 48a8 8 0 0 1-11.32 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a4 4 0 0 1 2.83 1.17L111 145a24 24 0 0 0 34 0l23.8-23.8a4 4 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16m-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </button>

                    </div>
                </div>
            </div>
        </>

    )
}

export default Generator
