import axios from "axios";

const kakaoApi = axios.create({
    baseURL : "https://dapi.kakao.com",
    headers : {
        Authorization : "KakaoAK 40dc65b056b30eb5353795459126521b"
    }
});

const kakaoSearch = params => {
    return kakaoApi.get("/v3/search/book", {params});
}

export default kakaoSearch;