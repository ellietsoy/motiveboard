package com.motiveboard.backend;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/board")
@CrossOrigin
public class boardController {

    private Map<String, Object> board;

    @PostMapping("/save")
    public void saveBoard(@RequestBody Map<String, Object> data) {
        board = data;
        System.out.println("Board saved!");
    }

    @GetMapping("/load")
    public Map<String, Object> loadBoard() {
        return board;
    }

}
