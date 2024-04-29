import axios from "axios";

const kakaoApi = axios.create({
    baseURL : "https://dapi.kakao.com",
    headers : {
        Authorization : `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`
    }
});

const kakaoSearch = params => {
    return kakaoApi.get("/v3/search/book", {params});
}

export default kakaoSearch;