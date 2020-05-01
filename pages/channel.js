import Layout from '../components/Layout';
import Banner from '../components/Banner';
import ChannelGrid from '../components/ChannelGrid';
import PodcastListWithClick from '../components/PodcastListWithClick';
import PodcastPlayer from '../components/PodcastPlayer';
import Error from './_error';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openPodcast: null };
  }

  static async getInitialProps({ query, res }) {
    try {
      let idChannel = query.id;

      let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`),
      ]);

      if (reqChannel.status >= 400) {
        res.statusCode = 404;
        return {
          channel: null,
          audioClips: null,
          series: null,
          statusCode: 404,
        };
      }

      let dataChannel = await reqChannel.json();
      let channel = dataChannel.body.channel;

      let dataAudios = await reqAudios.json();
      let audioClips = dataAudios.body.audio_clips;

      let dataSeries = await reqSeries.json();
      let series = dataSeries.body.channels;

      return { channel, audioClips, series, statusCode: 200 };
    } catch (error) {
      res.statusCode = 404;
      return { channel: null, audioClips: null, series: null, statusCode: 404 };
    }
  }

  openPodcast = (event, podcast) => {
    event.preventDefault();
    this.setState({
      openPodcast: podcast,
    });
  };

  closePodcast = (event) => {
    event.preventDefault();
    this.setState({
      openPodcast: null,
    });
  };

  render() {
    const { channel, audioClips, series, statusCode } = this.props;
    const { openPodcast } = this.state;

    //Patron Early Return
    if (statusCode !== 200) {
      return <Error statusCode={statusCode} />;
    }

    return (
      <Layout title={`${channel.title}`}>
        <Banner urlBanner={channel.urls.banner_image.original}></Banner>

        {openPodcast && (
          <PodcastPlayer clip={openPodcast} onClose={this.closePodcast} />
        )}
        <h1>{channel.title}</h1>

        {series.length > 0 && (
          <div>
            <h2>Series</h2>
            <ChannelGrid channels={series} />
          </div>
        )}

        <h2>Ultimos Podcasts</h2>
        <PodcastListWithClick
          podcasts={audioClips}
          onClickPodcast={this.openPodcast}
        />

        <style jsx>{`
          h1 {
            font-weight: 600;
            padding: 15px;
          }
        `}</style>
      </Layout>
    );
  }
}
