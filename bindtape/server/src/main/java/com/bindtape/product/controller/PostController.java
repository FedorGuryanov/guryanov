package com.bindtape.product.controller;

import com.bindtape.product.model.*;
import com.bindtape.product.repository.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.*;
import java.util.stream.Stream;

/**
 * @author fedorguryanov
 * @since 23.02.2018.
 */
@RestController
@RequestMapping("/posts")
public class PostController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private LikesRepository likesRepository;

    @Autowired
    private SavesRepository savesRepository;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private SongsRepository songsRepository;

    @Autowired
    private SongConnectionsRepository songConnectionsRepository;

    @Autowired
    private PlaylistsRepository playlistsRepository;

    @Autowired
    private PlaylistConnectionsRepository playlistConnectionsRepository;

    private Long tryToAddSong(JSONObject track, String storeId) {
        String songId = track.getString("song_id");
        Song song = songsRepository.findFirstBySongIdAndStoreId(songId, storeId);
        if (song == null) {
            song = new Song();
            song.setStoreId(storeId);
            song.setSongId(songId);
            song.setAuthor(track.getString("author"));
            song.setName(track.getString("name"));
            song.setAlbum(track.getString("album"));
            song.setYear(track.getString("year"));
            songsRepository.saveAndFlush(song);
        }
        return song.getId();
    }

    private Playlist formStorePlaylist(Playlist original, String storeId) {
        Long[] songIds = original.getSongIds();
        boolean addNewPlayConnect = true;
        for (int i = 0; i < songIds.length; i++) {
            Song song = songsRepository.findOne(songIds[i]);
            if (!song.getStoreId().equals(storeId)) {
                SongConnection connection = songConnectionsRepository.findFirstByFromIdAndToStoreId(songIds[i], storeId);
                if (connection != null) {
                    songIds[i] = connection.getToId();
                } else {
                    addNewPlayConnect = false;
                }
            }
        }
        if (addNewPlayConnect) {
            Playlist newPlaylist = new Playlist();
            newPlaylist.setPostId(original.getPostId());
            newPlaylist.setStoreId(storeId);
            newPlaylist.setSongIds(songIds);
            playlistsRepository.saveAndFlush(newPlaylist);

            PlaylistConnection playlistConnection = new PlaylistConnection();
            playlistConnection.setFromStoreId(original.getStoreId());
            playlistConnection.setFromId(original.getId());
            playlistConnection.setToStoreId(storeId);
            playlistConnection.setToId(newPlaylist.getId());
            playlistConnectionsRepository.saveAndFlush(playlistConnection);
        }
        return original;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getPosts(Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        String userStoreId = request.getParameter("storeId");
        String lastPostString = request.getParameter("lastPost");
        String postsUsername = request.getParameter("username");
        int postIndex = lastPostString != null ? Integer.valueOf(lastPostString) : 0;
        List<String> usernames = new ArrayList<>();//Collections.singletonList(name);
        if (postsUsername == null) {
            usernames.add(name);
            List<Follow> follows = followRepository.findByFollowerName(name);
            follows.forEach(item -> usernames.add(item.getFollowedName()));
        } else {
            usernames.add(postsUsername);
        }

        int page = postIndex / 10;
        Pageable topTen = new PageRequest(page, 10, Sort.Direction.DESC, "id");
        List<Post> posts = postsRepository.findByUsernameInOrderByIdDesc(usernames, topTen);
        List<Map<String, Object>> result = new ArrayList<>();
        processPostsList(name, userStoreId, posts, result);
        return result;
    }

    @RequestMapping(value = "/saved", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getSavedPosts(Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        String userStoreId = request.getParameter("storeId");
        String lastPostString = request.getParameter("lastPost");
        int postIndex = lastPostString != null ? Integer.valueOf(lastPostString) : 0;

        int page = postIndex / 10;
        Pageable topTen = new PageRequest(page, 10, Sort.Direction.DESC, "id");
        List<Save> saves = savesRepository.findByUsernameOrderByIdDesc(name, topTen);
        List<Long> ids = new ArrayList<>();
        if (saves != null) {
            saves.forEach((Save item) -> ids.add(item.getPostId()));
        }
        List<Post> postsDB = postsRepository.findByIdInOrderByIdDesc(ids);
        List<Post> posts = new ArrayList<>();
        ids.forEach(id -> {
            posts.add(postsDB.stream().filter(x -> id.equals(x.getId()))
                    .findFirst().get());
        });
        List<Map<String, Object>> result = new ArrayList<>();
        processPostsList(name, userStoreId, posts, result);
        return result;
    }

    @RequestMapping(value = "/discover", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getDiscoverPosts(Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        String userStoreId = request.getParameter("storeId");

        List<String> usernames = new ArrayList<>();//Collections.singletonList(name);
        usernames.add(name);

        Pageable top = new PageRequest(0, 30, Sort.Direction.DESC, "id");
        /*List<Long> postIds = new ArrayList<>();
        List<Playlist> playlists = playlistsRepository.findByStoreIdOrderByIdDesc(userStoreId, top);
        Random random = new Random();
        for (int i = 0; i < 10; i++) {
            int size = playlists.size();
            if (size > 0) {
                int randomInt = random.nextInt();
                randomInt = randomInt > 0 ? randomInt : -randomInt;
                int n = randomInt % size;
                postIds.add(playlists.get(n).getPostId());
                playlists.remove(n);
            } else {
                break;
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        processPostsList(name, userStoreId, postsRepository.findByIdInAndUsernameNot(postIds, name), result);*/
        String rs = request.getParameter("red");
        Float r = rs == null ? null :Float.valueOf(rs);
        String gs = request.getParameter("green");
        Float g = gs == null ? null :Float.valueOf(gs);
        String bs = request.getParameter("blue");
        Float b = bs == null ? null :Float.valueOf(bs);
        Boolean colored = r != null && g != null && b != null;
        if (!colored) {
            List<Follow> follows = followRepository.findByFollowerName(name);
            follows.forEach(item -> usernames.add(item.getFollowedName()));
        }
        Float dist = 0.2F;
        List<Post> postsFromDb = colored ?
                postsRepository.findByUsernameNotInAndRedGreaterThanAndRedLessThanAndGreenGreaterThanAndGreenLessThanAndBlueGreaterThanAndBlueLessThan(usernames, r - dist, r + dist, g - dist, g + dist, b - dist, b + dist, top)
                : postsRepository.findByUsernameNotIn(usernames, top);
        Random random = new Random();
        List<Post> selected = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            int size = postsFromDb.size();
            if (size > 0) {
                int randomInt = random.nextInt();
                randomInt = randomInt > 0 ? randomInt : -randomInt;
                int n = randomInt % size;
                selected.add(postsFromDb.get(n));
                postsFromDb.remove(n);
            } else {
                break;
            }
        }
        List<Map<String, Object>> result = new ArrayList<>();
        processPostsList(name, userStoreId, selected, result);
        return result;
    }

    private void processPostsList(String name, String userStoreId, List<Post> posts, List<Map<String, Object>> result) {
        List<Long> postIds = new ArrayList<>();
        posts.forEach(post -> {
            postIds.add(post.getId());
        });
        List<Like> likes = likesRepository.findByUsernameAndPostIdIn(name, postIds);
        List<Save> saves = savesRepository.findByUsernameAndPostIdIn(name, postIds);
        posts.forEach(post -> {
            Map<String, Object> postMap = new HashMap<String, Object>();
            postMap.put("id", post.getId());
            postMap.put("username", post.getUsername());
            postMap.put("text", post.getText());
            postMap.put("picture_url", post.getPictureUrl());
            postMap.put("likes_n", post.getLikesN());
            Long savesN = post.getSavesN();
            postMap.put("saves_n", savesN == null ? 0 : savesN);
            Long postTime = post.getPostTime();
            postMap.put("post_time", postTime == null ? 0 : postTime);
            Float red = post.getRed();
            postMap.put("red", red == null ? 1 : red);
            Float green = post.getGreen();
            postMap.put("green", green == null ? 1 : green);
            Float blue = post.getBlue();
            postMap.put("blue", blue == null ? 1 : blue);
            postMap.put("comments_n", post.getCommentsN());
            postMap.put("liked", likes.stream().anyMatch(item -> item.getPostId().equals(post.getId())));
            postMap.put("saved", saves.stream().anyMatch(item -> item.getPostId().equals(post.getId())));
            Playlist playlist = playlistsRepository.findOne(post.getOriginalPlaylistId());
            if (playlist != null) {
                String playlistStoreId = playlist.getStoreId();
                if (userStoreId != null && !userStoreId.equals(playlistStoreId)) {
                    PlaylistConnection connection = playlistConnectionsRepository.findFirstByFromIdAndToStoreId(playlist.getId(), userStoreId);
                    if (connection != null) {
                        playlist = playlistsRepository.getOne(connection.getToId());
                    } else {
                        playlist = formStorePlaylist(playlist, userStoreId);
                    }
                    playlistStoreId = playlist != null ? playlist.getStoreId() : null;
                }
                postMap.put("store_id", playlistStoreId);
                List<Song> songs = new ArrayList<>();
                Long[] songIds = playlist != null ? playlist.getSongIds() : null;
                if (songIds != null) {
                    for (Long songId : songIds) {
                        songs.add(songsRepository.findOne(songId));
                    }
                }
                postMap.put("tracks", songs);
            }
            result.add(postMap);
        });
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> createPost(Principal principal, MultipartHttpServletRequest request) {
        String name = principal.getName();
        if (name != null) {
            String text = request.getParameter("text");
            String tracksString = request.getParameter("tracks");
            Float r = Float.valueOf(request.getParameter("red"));
            Float g = Float.valueOf(request.getParameter("green"));
            Float b = Float.valueOf(request.getParameter("blue"));
            JSONArray tracks = new JSONArray(tracksString);
            String storeId = null;
            int tracksN = tracks.length();
            Long[] songIds = new Long[tracksN];
            for (int i = 0; i < tracksN; i++) {
                JSONObject track = tracks.getJSONObject(i);
                String trackStoreId = track.getString("store_id");
                if (storeId == null) {
                    storeId = trackStoreId;
                }
                if (storeId == null || ((!storeId.equals(trackStoreId)) && (trackStoreId != null))) {
                    return new ResponseEntity<>("NO or Multiple Store ID", HttpStatus.NOT_ACCEPTABLE);
                }
                Long songId = tryToAddSong(track, storeId);
                songIds[i] = songId;
            }
            MultiValueMap<String, MultipartFile> multiMap = request.getMultiFileMap();
            MultipartFile image = multiMap.getFirst("fileset");
            byte[] imageBytes;
            Post post = new Post();
            try {
                imageBytes = image.getBytes();
                int imageLength = imageBytes.length;
                if (imageLength > 2000000) { //420110   226864   289581 max_value 1 000 000
                    return new ResponseEntity<>("Too big Image Size!", HttpStatus.NOT_ACCEPTABLE);
                }
                post.setUsername(name);
                post.setLikesN(0L);
                post.setSavesN(0L);
                post.setCommentsN(0L);
                post.setRed(r);
                post.setGreen(g);
                post.setBlue(b);
                Date date = new Date();
                post.setPostTime(date.getTime());
                post.setText(text);
                post.setOriginalPlaylistId(0L);
                postsRepository.saveAndFlush(post);

                Long postId = post.getId();
                Playlist playlist = new Playlist();
                playlist.setPostId(postId);
                playlist.setStoreId(storeId);
                playlist.setSongIds(songIds);
                playlistsRepository.saveAndFlush(playlist);

                post.setOriginalPlaylistId(playlist.getId());
                postsRepository.saveAndFlush(post);

                BufferedImage src = ImageIO.read(new ByteArrayInputStream(imageBytes));
                File destination = new File("images/" + postId + ".jpg"); // something like C:/Users/tom/Documents/nameBasedOnSomeId.png
                ImageIO.write(src, "jpg", destination);
                return new ResponseEntity<>("Post Created", HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                if (post.getId() != null) {
                    playlistsRepository.delete(post.getId());
                }
                return new ResponseEntity<>("Fail", HttpStatus.NOT_ACCEPTABLE);
            }
        } else {
            return new ResponseEntity<>("Not enough info", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @RequestMapping(value = "/playlistConnect", method = RequestMethod.POST)
    public ResponseEntity<String> addPlaylistConnection(HttpServletRequest request) {
        try {
            Long postId = Long.decode(request.getParameter("postId"));
            Post originalPost = postsRepository.getOne(postId);
            Long originalPlaylistId = originalPost.getOriginalPlaylistId();
            Playlist originalPlaylist = playlistsRepository.findOne(originalPlaylistId);
            Long[] originalSongIds = originalPlaylist.getSongIds();
            String tracksString = request.getParameter("tracks");
            JSONArray tracks = new JSONArray(tracksString);
            String storeId = request.getParameter("storeId");
            int tracksN = tracks.length() <= originalSongIds.length ? tracks.length() : originalSongIds.length;
            String fromStoreId = originalPlaylist.getStoreId();
            Long[] songIds = new Long[tracksN];
            for (int i = 0; i < tracksN; i++) {
                JSONObject track = tracks.getJSONObject(i);
                String trackStoreId = track.getString("store_id");
                if (storeId == null) {
                    storeId = trackStoreId;
                }
                if (storeId == null || ((!storeId.equals(trackStoreId)) && (trackStoreId != null))) {
                    return new ResponseEntity<>("NO or Multiple Store ID", HttpStatus.NOT_ACCEPTABLE);
                }
                Long songId = tryToAddSong(track, storeId);
                SongConnection songConnection = new SongConnection();
                songConnection.setFromId(originalSongIds[i]);
                songConnection.setFromStoreId(fromStoreId);
                songConnection.setToId(songId);
                songConnection.setToStoreId(storeId);
                SongConnection sc = songConnectionsRepository.findFirstByFromIdAndToStoreId(originalSongIds[i], storeId);
                if (sc == null) {
                    songConnectionsRepository.saveAndFlush(songConnection);
                }
                songIds[i] = songId;
            }

            Playlist newPlaylist = new Playlist();
            newPlaylist.setPostId(postId);
            newPlaylist.setStoreId(storeId);
            newPlaylist.setSongIds(songIds);
            playlistsRepository.saveAndFlush(newPlaylist);

            PlaylistConnection playlistConnection = new PlaylistConnection();
            playlistConnection.setFromStoreId(fromStoreId);
            playlistConnection.setFromId(originalPlaylistId);
            playlistConnection.setToStoreId(storeId);
            playlistConnection.setToId(newPlaylist.getId());
            PlaylistConnection pc = playlistConnectionsRepository.findFirstByFromIdAndToStoreId(originalPlaylistId, storeId);
            if (pc == null) {
                playlistConnectionsRepository.saveAndFlush(playlistConnection);
            }

            return new ResponseEntity<>("Connect created", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/like/{postId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, String>> likePost(@PathVariable String postId, Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        Long id = Long.parseLong(postId);
        Like like = likesRepository.findFirstByUsernameAndPostId(name, id);
        if (like == null) {
            Post post = postsRepository.findOne(id);
            if (post != null) {
                post.setLikesN(post.getLikesN() + 1);
                postsRepository.saveAndFlush(post);
                like = new Like();
                like.setUsername(name);
                like.setPostId(id);
                likesRepository.saveAndFlush(like);
            }
        }
        return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
    }

    @RequestMapping(value = "/likes/{postId}/search/{search}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<UserInfo>> getSearchPostLikes(@PathVariable String postId, @PathVariable String search, HttpServletRequest request) {
        try {
            Long id = Long.parseLong(postId);
            List<Like> likes = likesRepository.findByPostIdAndUsernameStartingWithIgnoreCase(id, search, new PageRequest(0, 100, Sort.Direction.DESC, "id"));
            List<UserInfo> users = new ArrayList<>();
            if (likes != null) {
                likes.forEach(like -> {
                    UserInfo info = new UserInfo();
                    info.setUsername(like.getUsername());
                    users.add(info);
                });
            }
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.emptyList(), HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/likes/{postId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<List<UserInfo>> getPostLikes(@PathVariable String postId, Principal principal, HttpServletRequest request) {
        Long id = Long.parseLong(postId);
        List<Like> likes = likesRepository.findByPostId(id, new PageRequest(0, 100, Sort.Direction.DESC, "id"));
        List<UserInfo> users = new ArrayList<>();
        if (likes != null) {
            likes.forEach(like -> {
                UserInfo info = new UserInfo();
                info.setUsername(like.getUsername());
                users.add(info);
            });
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @RequestMapping(value = "/unlike/{postId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, String>> unlikePost(@PathVariable String postId, Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        Long id = Long.parseLong(postId);
        Like like = likesRepository.findFirstByUsernameAndPostId(name, id);
        if (like != null) {
            Post post = postsRepository.findOne(id);
            if (post != null) {
                post.setLikesN(post.getLikesN() - 1);
                postsRepository.saveAndFlush(post);
            }
            likesRepository.delete(like.getId());
            likesRepository.flush();
        }
        return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
    }

    @RequestMapping(value = "/save/{postId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, String>> savePost(@PathVariable String postId, Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        Long id = Long.parseLong(postId);
        Save save = savesRepository.findFirstByUsernameAndPostId(name, id);
        if (save == null) {
            Post post = postsRepository.findOne(id);
            if (post != null) {
                Long savesN = post.getSavesN();
                savesN = savesN == null ? 0 : savesN;
                post.setSavesN(savesN + 1);
                postsRepository.saveAndFlush(post);
                save = new Save();
                save.setUsername(name);
                save.setPostId(id);
                savesRepository.saveAndFlush(save);
            }
        }
        return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
    }

    @RequestMapping(value = "/unsave/{postId}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, String>> unsavePost(@PathVariable String postId, Principal principal, HttpServletRequest request) {
        String name = principal.getName();
        Long id = Long.parseLong(postId);
        Save save = savesRepository.findFirstByUsernameAndPostId(name, id);
        if (save != null) {
            Post post = postsRepository.findOne(id);
            if (post != null) {
                Long savesN = post.getSavesN();
                savesN = savesN == null ? 1 : savesN;
                post.setSavesN(savesN - 1);
                postsRepository.saveAndFlush(post);
            }
            savesRepository.delete(save.getId());
            savesRepository.flush();
        }
        return new ResponseEntity<>(Collections.emptyMap(), HttpStatus.OK);
    }

    @RequestMapping(value = "/getImage/{imageId}", method = RequestMethod.GET, produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@PathVariable String imageId, HttpServletRequest request) {
        try {
            return new ResponseEntity<>(Files.readAllBytes(Paths.get("images/" + imageId + ".jpg")), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new byte[0], HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
