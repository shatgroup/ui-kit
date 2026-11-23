import type { Episode, Movie } from "@/components/streaming/types.ts"

export const genreNames = ["Hành động", "Tình cảm", "Hài", "Khoa học", "Gia đình", "Kinh dị"]

const episodeTitles = ["Khởi đầu", "Người cũ", "Đêm mưa", "Lối tắt", "Bữa cơm", "Biển hiệu", "Nửa đường", "Trở lại"]

function episodes(id: string): Episode[] {
  return episodeTitles.map((title, index) => ({
    id: `${id}-${index + 1}`,
    number: index + 1,
    title,
    duration: `${40 + index} phút`,
  }))
}

const demo = {
  libraryId: "197133",
  videoId: "dc48a09e-d9bb-420a-83d7-72dc2304c034",
}

function movie(input: Omit<Movie, "libraryId" | "videoId" | "episodes">): Movie {
  return { ...input, ...demo, episodes: episodes(input.id) }
}

export const movies: Movie[] = [
  movie({
    id: "mua-ha",
    title: "Mùa hạ năm ấy",
    description: "Một mùa hè ở thị trấn ven sông, hai người bạn cũ gặp lại sau nhiều năm. Những buổi chiều mưa, căn bếp nhỏ và chuyến xe đêm dần kéo họ về một lựa chọn không thể trì hoãn. Bộ phim đi chậm, dành chỗ cho khoảng lặng và những câu nói bỏ dở.",
    image: "/posters/mua-ha.svg",
    badge: "Mới",
    genres: ["Tình cảm"],
    year: 2024,
    runtime: "1 giờ 48 phút",
  }),
  movie({
    id: "dem-sai-gon",
    title: "Đêm Sài Gòn",
    description: "Một tài xế ca đêm vô tình chở một người lạ đang bị truy đuổi. Từ hẻm nhỏ ra xa lộ, anh phải chọn giữa việc trả khách và việc giữ mạng. Phim chạy liên tục, nhưng mỗi lần dừng xe lại lộ thêm một mảnh quá khứ.",
    image: "/posters/dem-sai-gon.svg",
    badge: "Top 10",
    genres: ["Hành động"],
    year: 2023,
    runtime: "1 giờ 56 phút",
  }),
  movie({
    id: "bep-nho",
    title: "Bếp nhỏ cuối hẻm",
    description: "Quán cơm của mẹ sắp đóng cửa. Ba chị em về nhà trong cùng một tuần, mỗi người mang một lý do chưa nói. Bữa cơm cuối cùng buộc họ ngồi lại đủ lâu để nghe hết câu chuyện của nhau.",
    image: "/posters/bep-nho.svg",
    genres: ["Gia đình"],
    year: 2022,
    runtime: "1 giờ 42 phút",
  }),
  movie({
    id: "tram-cuoi",
    title: "Trạm cuối",
    description: "Trên một trạm nghiên cứu ngoài khơi, tín hiệu mặt đất đột ngột mất. Nhóm trực đêm phát hiện nhật ký của ca trước không khớp với những gì họ đang thấy. Càng đối chiếu, họ càng không chắc mình còn ở đúng thời điểm.",
    image: "/posters/tram-cuoi.svg",
    badge: "Độc quyền",
    genres: ["Khoa học"],
    year: 2025,
    runtime: "2 giờ 05 phút",
  }),
  movie({
    id: "cuoi-pho",
    title: "Cười xuyên phố",
    description: "Một nhóm hài đường phố nhận show cuối cùng trước khi rạp cũ bị đập. Họ cố diễn cho xong đêm, trong lúc từng người đang giấu một rắc rối riêng. Tiếng cười trên sân khấu và khoảng im lặng sau cánh gà nằm sát nhau.",
    image: "/posters/cuoi-pho.svg",
    genres: ["Hài"],
    year: 2024,
    runtime: "1 giờ 39 phút",
  }),
  movie({
    id: "song-can",
    title: "Sông cạn",
    description: "Mùa hạn làm lộ một cây cầu cũ dưới lòng sông. Người quay phim trở về quê để ghi lại hình ảnh đó và gặp lại người từng hẹn cùng rời đi. Bộ phim là một lá thư gửi chậm, viết bằng bụi, nước và những thước phim chưa cắt.",
    image: "/posters/song-can.svg",
    genres: ["Tình cảm"],
    year: 2021,
    runtime: "1 giờ 51 phút",
  }),
  movie({
    id: "lop-hoc",
    title: "Lớp học ban đêm",
    description: "Lớp bổ túc cho người lớn bắt đầu với tám học viên và một giáo viên mới. Bài tập về nhà của họ không phải công thức, mà là những việc họ đã trì hoãn quá lâu. Mỗi buổi học khép lại bằng một câu chuyện không ai định kể.",
    image: "/posters/lop-hoc.svg",
    genres: ["Hài", "Gia đình"],
    year: 2023,
    runtime: "1 giờ 44 phút",
  }),
  movie({
    id: "xuong-sang",
    title: "Xưởng ánh sáng",
    description: "Xưởng phim tỉnh lẻ nhận một cuộn phim không có nhãn. Nhóm dựng thử phát hiện từng cảnh khớp với những việc vừa xảy ra trong thị trấn. Họ phải quyết định chiếu bộ phim đó, hay giấu nó đi trước buổi công chiếu.",
    image: "/posters/xuong-sang.svg",
    genres: ["Khoa học"],
    year: 2020,
    runtime: "1 giờ 58 phút",
  }),
  movie({
    id: "ve-nha",
    title: "Về nhà ăn cơm",
    description: "Sau mười năm, người con út về quê đúng bữa giỗ. Ngôi nhà vẫn chỗ cũ, nhưng mỗi người trong bàn ăn đã đổi một thói quen nhỏ. Bộ phim theo họ qua ba ngày, đủ để một câu xin lỗi tìm được chỗ ngồi.",
    image: "/posters/ve-nha.svg",
    badge: "Mới",
    genres: ["Gia đình"],
    year: 2025,
    runtime: "1 giờ 36 phút",
  }),
  movie({
    id: "pho-khong-ngu",
    title: "Phố không ngủ",
    description: "Một phóng viên ảnh đi bộ xuyên thành phố trong mười hai giờ để theo một tin đồn. Mỗi quán mở cửa khuya đưa cô tới một người từng thấy cùng một chiếc xe. Khi trời sáng, tấm ảnh cô cần lại nằm trong máy của chính mình.",
    image: "/posters/pho-khong-ngu.svg",
    genres: ["Hành động"],
    year: 2024,
    runtime: "1 giờ 47 phút",
  }),
  movie({
    id: "anh-vo",
    title: "Ảnh vỡ",
    description: "Một thợ in ảnh nhận tấm hình không có mặt người. Càng sửa, hình càng mất chi tiết. Anh lần theo địa chỉ ghi sau tấm ảnh và nhận ra mình đang in lại một ngày mà cả phố đã thống nhất là chưa từng xảy ra.",
    image: "/posters/khong-co.svg",
    genres: ["Hành động"],
    year: 2022,
    runtime: "1 giờ 33 phút",
  }),
]

export const heroMovies = movies.slice(0, 4)
