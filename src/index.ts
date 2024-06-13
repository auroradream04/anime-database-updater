import axios from "axios";
import prisma from "./prisma";
const express = require("express");

const app = express();

app.get('/', (req: any, res: any) => {
    res.json("Hello World")
});

app.get('/generate', async (req: any, res: any) => {
    const url = req.query.url;
    const hoursParam = req.query.hours;
    let page = 1;
    let pageCount = 1;

    while (page <= pageCount) {
        const response = await axios.get(`${url}?ac=list&ac=videolist&pg=${page}${hoursParam ? `&h=${hoursParam}` : ''}`);
        const data = response.data;

        pageCount = data.pagecount;
        const videoList = data.list; // Array of objects

        for (const video of videoList) {
            if (video.type_name === "伦理片") {
                continue;
            }
            await prisma.video.upsert({
                where: {
                    apiId: video.vod_id,
                },
                create: {
                    apiId: video.vod_id,
                    title: video.vod_name,
                    otherTitle: video.vod_sub,
                    description: video.vod_content,
                    blurb: video.vod_blurb,
                    image: video.vod_pic.replace("img.test", "funaxun"),
                    cast: video.vod_actor,
                    author: video.vod_writer,
                    director: video.vod_director,
                    category: video.type_name,
                    publishYear: video.vod_year,
                    url: video.vod_play_url,
                },
                update: {
                    title: video.vod_name,
                    otherTitle: video.vod_sub,
                    description: video.vod_content,
                    blurb: video.vod_blurb,
                    image: video.vod_pic.replace("img.test", "funaxun"),
                    cast: video.vod_actor,
                    author: video.vod_writer,
                    director: video.vod_director,
                    category: video.type_name,
                    publishYear: video.vod_year,
                    url: video.vod_play_url,
                }
            })
        }

        page++;
    }

    res.json("Data generated successfully")
});

app.listen(7000, () => {
    console.log("Server is running on port 7000")
});


//https://bfzyapi.com/api.php/provide/vod/