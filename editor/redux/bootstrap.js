/**
 * Created by neo on 2016. 10. 17..
 */

export default function bootstrap(orm) {
  // Get the empty state according to our schema.
  const state = orm.getEmptyState();

  // Begin a mutating session with that state.
  // `state` will be mutated.
  const session = orm.session(state);

  const { AppState } = session;
  AppState.create({});

  // Model classes are available as properties of the
  // Session instance.
  //const {Book} = session;

  // console.log('111 ', orm);
  // console.log('222', state);
  // console.log('333', session);
  // console.log('444', session.Book);

  /*****
   * Asset
   */
  // const asset1 = Asset.create({
  //   s3Id: 1,
  //   src:'http://cfile25.uf.tistory.com/image/1152C5224B60F4538AD9F3',
  //   sourceType: 'link',
  //   assetType: 'image',
  //   createdDate: 'today',
  //   title: 'neo asset',
  //   fileSize: 100, //   page: 0
  // });
  //
  // const asset2 = Asset.create({
  //   s3Id: 2,
  //   src:'http://cfile27.uf.tistory.com/image/18536F224B60F454792247',
  //   sourceType: 'link',
  //   assetType: 'image',
  //   createdDate: 'today',
  //   title: 'neo asset',
  //   fileSize: 100,
  //   page: 0
  // });
  //
  // const asset3 = Asset.create({
  //   s3Id: 3,
  //   src:'https://carlaspeaks.files.wordpress.com/2013/01/c31.jpg',
  //   sourceType: 'link',
  //   assetType: 'image',
  //   createdDate: 'today',
  //   title: 'neo asset',
  //   fileSize: 100,
  //   page: 0
  // });
  //
  // const asset4 = Asset.create({
  //   s3Id: 4,
  //   src:'http://www.bestmotherofthegroomspeeches.com/wp-content/themes/thesis/rotator/sample-1.jpg',
  //   sourceType: 'link',
  //   assetType: 'image',
  //   createdDate: 'today',
  //   title: 'test asset',
  //   fileSize: 100,
  //   page: 0
  // });

  /******
   * ComponentEvent
   */
  // const event1 = ComponentEvent.create({
  //   id: 0,
  //   name: 'test event',
  //   trigger: CT.EVENT_TRIGGER.pageLoaded,
  //   page: 0,
  //   asset: asset4,
  //   event: {
  //     name: 'toggleVisible'
  //   }
  // });

  /****
   * VisibleProperty
   */

  // const vProperty1 = VisibleProperty.create({
  //   scale: {
  //     width: 100,
  //     height: 100
  //   },
  //   position: {x: 100, y: 100},
  //   angle: 0,
  //   opacity: 0,
  //   visible: true,
  //   lock: false,
  //   page: 0
  // });
  //
  // const vProperty2 = VisibleProperty.create({
  //   scale: {
  //     width: 200,
  //     height: 200
  //   },
  //   position: {x: 200, y: 300},
  //   angle: 0,
  //   opacity: 1,
  //   visible: true,
  //   lock: false,
  //   page: 0
  // });
  //
  // const vProperty3 = VisibleProperty.create({
  //   scale: {
  //     width: 200,
  //     height: 100
  //   },
  //   position: {x: 300, y: 100},
  //   angle: 0,
  //   opacity: 1,
  //   visible: true,
  //   lock: false,
  //   page: 0
  // });
  //
  // const vProperty4 = VisibleProperty.create({
  //   scale: {
  //     width: 200,
  //     height: 100
  //   },
  //   position: {x: 400, y: 200},
  //   angle: 0,
  //   opacity: 1,
  //   visible: true,
  //   lock: false,
  //   page: 0
  // });

  /******
   * ImageComponent
   */
  // const imageCom1 = ImageComponent.create({
  //   id: 0,
  //   size: {
  //     width: 100,
  //     height: 100
  //   },
  //   visibleProperty: vProperty1,
  //   asset: asset1,
  //   events: [0]
  // });
  //
  // const imageCom2 = ImageComponent.create({
  //   id: 1,
  //   size: {
  //     width: 100,
  //     height: 100
  //   },
  //   visibleProperty: vProperty2,
  //   asset: asset2,
  //   events: []
  // });
  //
  // const imageCom3 = ImageComponent.create({
  //   id: 2,
  //   size: {
  //     width: 100,
  //     height: 100
  //   },
  //   visibleProperty: vProperty4,
  //   asset: asset3,
  //   events: []
  // });

  /******
   * TextComponent
   */
  // const textCom1 = TextComponent.create({
  //   id: 0,
  //   text: 'test neo',
  //   visibleProperty: vProperty3
  // });
  //
  //
  // Page.create({
  //   id: 1,
  //   title: 'init page - 1',
  //
  //   imageComponents: [0, 1],
  //   textComponents: [0],
  //   //imageComponents: [],
  //   //textComponents: [],
  // });
  //
  // Page.create({
  //   id : 2,
  //   title: 'init page - 2',
  //   imageComponents: [2],
  //   textComponents: [],
  // });
  //
  // Page.create({
  //   id : 3,
  //   title: 'init page - 3',
  //   imageComponents: [],
  //   textComponents: [],
  // });

  // Book.create({
  //     canvasProperty: {
  //         backgroundColor: 'rgb(100,100,200)',
  //         width: 800,
  //         height: 500,
  //         selectionColor: 'blue',
  //         selectionLineWidth: 2
  //     }
  // });

  // Return the whole Redux initial state.
  return {
    orm: session.state
  };
}
