import {Split} from '../motion';
import {projects} from '../data';
import Cubes from '../Cubes';

export default function Work() {
  return (
    <section className="page work-cubes">
      <Split as="h1" className="wc-h">Projects</Split>
      <p className="wc-sub" data-r>Swipe the cube for the next project. Tap it to open.</p>
      <Cubes items={projects} big showBody />
    </section>
  );
}
