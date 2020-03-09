export const getMicrophone =  async () => {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
}