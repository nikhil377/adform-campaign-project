import { render } from '@testing-library/react';
import PageLoader from '../common/PageLoader/';

describe('PageLoader component', () => {
  it('should render a loader element', () => {
    const { getByTestId } = render(<PageLoader />);
    const loader = getByTestId('page-loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('loader');
  });
});