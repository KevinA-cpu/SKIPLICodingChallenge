export function shareCaptionThroughEmail(caption: string) {
  // Share on mobile devices
  if (navigator.share) {
    navigator.share({
      title: 'Check out this caption!',
      text: caption,
      url: window.location.href,
    });
  } else {
    // Share via email
    window.location.href = `mailto:?subject=Check out this caption!&body=${caption}`;
  }
}

export function shareCaptionOnFacebook(caption: string) {
  //Quote feature deprecated by Facebooks
  const url = `https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fgithub.com&quote=${encodeURIComponent(
    caption
  )}`;
  window.open(url, '_blank');
}
