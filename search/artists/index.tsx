
import { DIRECTORY_ARTISTS } from '../../constants';
import { DirectoryArtist } from '../../types';

// NOTE: This file acts as a mock server-side API endpoint.
// The exported function simulates the behavior of handling a GET request
// to /search/artists with various query parameters.

export default function GET(request: { url: string }) {
  const url = new URL(request.url, `http://localhost`); // Base URL is needed for constructor
  const queryParams = url.searchParams;

  let results: DirectoryArtist[] = [...DIRECTORY_ARTISTS];

  // --- Filtering ---
  const category = queryParams.get('category');
  if (category) {
    results = results.filter(artist => artist.category === category);
  }
  
  const subcategory = queryParams.get('subcategory');
  if (subcategory) {
    results = results.filter(artist => artist.subcategory === subcategory);
  }

  const state = queryParams.get('state');
  if (state) {
    results = results.filter(artist => artist.state === state);
  }

  const district = queryParams.get('district');
  if (district) {
    results = results.filter(artist => artist.district === district);
  }

  const block = queryParams.get('block');
  if (block) {
    results = results.filter(artist => artist.block === block);
  }

  const pincode = queryParams.get('pincode');
  if (pincode) {
    results = results.filter(artist => artist.pincode === pincode);
  }

  const experienceMin = queryParams.get('experienceMin');
  if (experienceMin) {
    results = results.filter(artist => (artist.experience ?? 0) >= parseInt(experienceMin, 10));
  }

  const experienceMax = queryParams.get('experienceMax');
  if (experienceMax) {
    results = results.filter(artist => (artist.experience ?? 0) <= parseInt(experienceMax, 10));
  }
  
  const budgetMin = queryParams.get('budgetMin');
  if (budgetMin) {
    results = results.filter(artist => (artist.startingPrice ?? 0) >= parseInt(budgetMin, 10));
  }

  const budgetMax = queryParams.get('budgetMax');
  if (budgetMax) {
    results = results.filter(artist => (artist.startingPrice ?? 0) <= parseInt(budgetMax, 10));
  }
  
  const ratingMin = queryParams.get('ratingMin');
  if (ratingMin) {
    results = results.filter(artist => artist.rating >= parseFloat(ratingMin));
  }
  
  const verifiedOnly = queryParams.get('verifiedOnly');
  if (verifiedOnly === 'true') {
    results = results.filter(artist => artist.verified);
  }

  const onlineStatus = queryParams.get('onlineStatus');
  if (onlineStatus && ['Online', 'Offline'].includes(onlineStatus)) {
    results = results.filter(artist => artist.availability === onlineStatus || artist.availability === 'Both');
  }

  const skills = queryParams.getAll('skills[]');
  if (skills && skills.length > 0 && skills[0]) {
    results = results.filter(artist => 
      skills.every(skill => 
        artist.skills.some(artistSkill => artistSkill.toLowerCase() === skill.toLowerCase())
      )
    );
  }

  const totalResults = results.length;

  // --- Sorting ---
  const sortBy = queryParams.get('sortBy') || 'recommended';
  switch (sortBy) {
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'priceLowToHigh':
      results.sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
      break;
    case 'priceHighToLow':
      results.sort((a, b) => (b.startingPrice ?? 0) - (a.startingPrice ?? 0));
      break;
    case 'newest':
      results.sort((a, b) => {
        const dateA = a.joinedDate ? new Date(a.joinedDate).getTime() : 0;
        const dateB = b.joinedDate ? new Date(b.joinedDate).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case 'recommended':
    default:
      // Simple recommendation: trending > high rating > more bookings
      results.sort((a, b) => {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return (b.bookings ?? 0) - (a.bookings ?? 0);
      });
      break;
  }

  // --- Pagination ---
  const page = parseInt(queryParams.get('page') || '1', 10);
  const limit = parseInt(queryParams.get('limit') || '20', 10);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  // --- Response ---
  const response = {
    totalResults,
    page,
    pageSize: limit,
    results: paginatedResults,
  };
  
  // In a real framework, this would be `return res.json(response)`.
  // Here, we simulate a Response object.
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
}
