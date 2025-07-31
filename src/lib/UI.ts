import { type AnimationClip } from 'three'
import { AnimationSearch, type AnimationWithState } from './AnimationSearch'

export class UI {
  dom_current_step_index: HTMLElement | null = null
  dom_current_step_element: HTMLElement | null = null
  dom_load_model_tools: HTMLElement | null = null
  dom_upload_model_button: HTMLButtonElement | null = null
  dom_load_model_button: HTMLButtonElement | null = null
  dom_load_model_debug_checkbox: HTMLInputElement | null = null

  // Animation search functionality
  private animation_search: AnimationSearch | null = null

  // load skeleton UI
  dom_rotate_model_x_button: HTMLButtonElement | null = null
  dom_rotate_model_y_button: HTMLButtonElement | null = null
  dom_rotate_model_z_button: HTMLButtonElement | null = null
  dom_move_model_to_floor_button: HTMLButtonElement | null = null

  dom_load_skeleton_tools: HTMLElement | null = null
  dom_load_skeleton_button: HTMLButtonElement | null = null
  dom_skeleton_edit_tools: HTMLElement | null = null
  dom_skeleton_drop_type: HTMLSelectElement | null = null
  dom_hand_skeleton_options: HTMLElement | null = null
  dom_hand_skeleton_selection: HTMLSelectElement | null = null
  dom_mirror_skeleton_checkbox: HTMLElement | null = null
  dom_scale_skeleton_button: HTMLButtonElement | null = null
  dom_undo_button: HTMLButtonElement | null = null
  dom_redo_button: HTMLButtonElement | null = null
  dom_bind_pose_button: HTMLButtonElement | null = null
  dom_scale_skeleton_input_box: HTMLElement | null = null
  dom_move_to_origin_button: HTMLButtonElement | null = null

  // edit skeleton UI step controls
  dom_selected_bone_label: HTMLElement | null = null
  dom_transform_type_radio_group: HTMLElement | null = null

  dom_skinning_algorithm_selection: HTMLElement | null = null
  dom_skinned_mesh_tools: HTMLElement | null = null
  dom_skinned_mesh_animation_tools: HTMLElement | null = null
  dom_show_skeleton_checkbox: HTMLElement | null = null
  dom_back_to_edit_skeleton_button: HTMLButtonElement | null = null
  dom_enable_skin_debugging: HTMLInputElement | null = null

  dom_mesh_preview_group: HTMLElement | null = null

  // animations listing UI controls
  dom_animation_clip_list: HTMLElement | null = null
  dom_export_button: HTMLButtonElement | null = null

  dom_info_container: HTMLElement | null = null
  dom_info_panel: HTMLElement | null = null

  dom_import_animations_button: HTMLButtonElement | null = null
  dom_extend_arm_input: HTMLElement | null = null
  dom_extend_arm_button: HTMLButtonElement | null = null
  dom_export_button_hidden_link: HTMLElement | null = null
  dom_build_version: HTMLElement | null = null

  // changing views buttons when editing skeleton
  dom_view_front_change: HTMLButtonElement | null = null
  dom_view_side_change: HTMLButtonElement | null = null
  dom_view_top_change: HTMLButtonElement | null = null

  constructor () {
    this.initialize_dom_elements()
    // AnimationSearch will be initialized when needed
  }

  private initialize_dom_elements (): void {
    // grab all UI Elements from page that we need to interact with
    this.dom_current_step_index = document.querySelector('#current-step-index')
    this.dom_current_step_element = document.querySelector('#current-step-label')

    // UI controls for loading the model
    this.dom_load_model_tools = document.querySelector('#load-model-tools')
    this.dom_upload_model_button = document.querySelector('#model-upload')
    this.dom_load_model_button = document.querySelector('#load-model-button')
    this.dom_load_model_debug_checkbox = document.querySelector('#load-model-debug-checkbox')

    // UI controls with load skeleton step
    this.dom_rotate_model_x_button = document.querySelector('#rotate-model-x-button')
    this.dom_rotate_model_y_button = document.querySelector('#rotate-model-y-button')
    this.dom_rotate_model_z_button = document.querySelector('#rotate-model-z-button')
    this.dom_move_model_to_floor_button = document.querySelector('#move-model-to-floor-button')

    // UI controls for loading/working with skeleton
    this.dom_load_skeleton_tools = document.querySelector('#load-skeleton-tools')
    this.dom_load_skeleton_button = document.querySelector('#load-skeleton-button')
    this.dom_skeleton_edit_tools = document.querySelector('#skeleton-step-actions')
    this.dom_skeleton_drop_type = document.querySelector('#skeleton-selection')
    this.dom_hand_skeleton_options = document.querySelector('#hand-skeleton-options')
    this.dom_hand_skeleton_selection = document.querySelector('#hand-skeleton-selection')
    this.dom_mirror_skeleton_checkbox = document.querySelector('#mirror-skeleton')
    this.dom_scale_skeleton_button = document.querySelector('#scale-skeleton-button')
    this.dom_undo_button = document.querySelector('#undo-button')
    this.dom_redo_button = document.querySelector('#redo-button')

    this.dom_selected_bone_label = document.querySelector('#edit-selected-bone-label')

    this.dom_transform_type_radio_group = document.querySelector('#transform-control-type-group')

    this.dom_bind_pose_button = document.querySelector('#action_bind_pose')
    this.dom_scale_skeleton_input_box = document.querySelector('#scale-input')
    this.dom_move_to_origin_button = document.querySelector('#action_move_to_origin')
    this.dom_skinning_algorithm_selection = document.querySelector('#skinning-algorithm-options')

    this.dom_mesh_preview_group = document.querySelector('#mesh-preview-group')

    // UI controls for changing views
    this.dom_view_front_change = document.querySelector('#front-view-button')
    this.dom_view_side_change = document.querySelector('#side-view-button')
    this.dom_view_top_change = document.querySelector('#top-view-button')

    // UI controls for working with skinned mesh
    this.dom_skinned_mesh_tools = document.querySelector('#skinned-step-tools')
    this.dom_skinned_mesh_animation_tools = document.querySelector('#skinned-step-animation-export-options')
    this.dom_show_skeleton_checkbox = document.querySelector('#show-skeleton-checkbox')
    this.dom_back_to_edit_skeleton_button = document.querySelector('#action_back_to_edit_skeleton')
    this.dom_enable_skin_debugging = document.querySelector('#debug-skinning-checkbox')

    // UI Controls for working with animation list/selection and export
    this.dom_animation_clip_list = document.querySelector('#animations-items')
    this.dom_export_button = document.querySelector('#export-button')

    this.dom_info_container = document.querySelector('#info-panel')
    this.dom_info_panel = document.querySelector('#info-messaging')

    this.dom_extend_arm_input = document.querySelector('#extend-arm-input')
    this.dom_extend_arm_button = document.querySelector('#extend-arm-button')

    this.dom_build_version = document.querySelector('#build-version')

    // UI for exporting the animation
    this.dom_export_button_hidden_link = document.querySelector('#download-hidden-link')
  }

  public hide_all_elements (): void {
    if (this.dom_load_model_tools != null) {
      this.dom_load_model_tools.style.display = 'none'
    }
    if (this.dom_load_skeleton_tools != null) {
      this.dom_load_skeleton_tools.style.display = 'none'
    }
    if (this.dom_skeleton_edit_tools != null) {
      this.dom_skeleton_edit_tools.style.display = 'none'
    }
    if (this.dom_skinned_mesh_tools != null) {
      this.dom_skinned_mesh_tools.style.display = 'none'
    }
    if (this.dom_skinned_mesh_animation_tools != null) {
      this.dom_skinned_mesh_animation_tools.style.display = 'none'
    }
  }

  public build_animation_clip_ui (animation_clips_to_load: AnimationClip[]): void {
    // Initialize AnimationSearch if not already done
    if (this.animation_search === null) {
      this.animation_search = new AnimationSearch('animation-filter', 'animations-items')
    }

    // Use the animation search class to handle the UI
    this.animation_search.initialize_animations(animation_clips_to_load)
  }

  public get_animated_selected_elements (): NodeListOf<Element> {
    // this needs to be called ad-hoc as selections might change
    return document.querySelectorAll('#animations-items input[type="checkbox"]')
  }

  public get_selected_animations (): AnimationWithState[] {
    if (this.animation_search === null) {
      return []
    }
    return this.animation_search.get_selected_animations()
  }

  public get_selected_animation_indices (): number[] {
    if (this.animation_search === null) {
      return []
    }
    return this.animation_search.get_selected_animation_indices()
  }
}
