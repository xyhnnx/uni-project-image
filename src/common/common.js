export async function showVideoAd(videoAd) {
    if (videoAd) {
        let res
        try {
            res = await videoAd.show()
        } catch (err) {
            console.log(err)
            try {
                await videoAd.load()
                await videoAd.show()
            } catch (e) {
                console.log('激励视频 广告显示失败1')
            }
        }
    }
}